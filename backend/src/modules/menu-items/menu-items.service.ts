import type { Repository } from 'typeorm'

import { AppDataSource } from '../../database/data-source.js'
import type { AuthenticatedRequestUser } from '../auth/types/auth.types.js'
import { applyMenuItemSorting } from '../menu/menu-sort.helpers.js'
import { MenuRestaurantGuardService } from '../menu/menu-restaurant-guard.service.js'
import { MenuCategoriesService } from '../menu-categories/menu-categories.service.js'
import { MenuCategory } from '../menu-categories/entities/menu-category.entity.js'
import { Restaurant } from '../restaurants/entities/restaurant.entity.js'
import { RestaurantUser } from '../restaurants/entities/restaurant-user.entity.js'
import type { CreateMenuItemDto } from './dto/create-menu-item.dto.js'
import type { UpdateMenuItemDto } from './dto/update-menu-item.dto.js'
import { MenuItem } from './entities/menu-item.entity.js'
import {
  MenuItemCategoryIdRequiredError,
  MenuItemCategoryNotFoundError,
  MenuItemCategoryRestaurantMismatchError,
  MenuItemIdRequiredError,
  MenuItemNotFoundError,
  MenuItemsHttpError
} from './menu-items.errors.js'
import {
  MenuCategoryNotFoundError,
  MenuCategoryRestaurantMismatchError,
  MenuDomainError,
  MenuItemRestaurantMismatchError
} from '../menu/menu.errors.js'

export class MenuItemsService {
  private readonly menuItemRepository: Repository<MenuItem>
  private readonly menuRestaurantGuardService: MenuRestaurantGuardService
  private readonly menuCategoriesService: MenuCategoriesService

  constructor(
    menuItemRepository: Repository<MenuItem> = AppDataSource.getRepository(MenuItem),
    menuCategoryRepository: Repository<MenuCategory> = AppDataSource.getRepository(
      MenuCategory
    ),
    restaurantRepository: Repository<Restaurant> = AppDataSource.getRepository(Restaurant),
    restaurantUserRepository: Repository<RestaurantUser> = AppDataSource.getRepository(
      RestaurantUser
    )
  ) {
    this.menuItemRepository = menuItemRepository
    this.menuRestaurantGuardService = new MenuRestaurantGuardService(
      restaurantRepository,
      restaurantUserRepository
    )
    this.menuCategoriesService = new MenuCategoriesService(
      menuCategoryRepository,
      AppDataSource.getRepository(MenuItem),
      restaurantRepository,
      restaurantUserRepository
    )
  }

  async createItem(
    restaurantId: string,
    dto: CreateMenuItemDto,
    actor: AuthenticatedRequestUser | undefined
  ): Promise<MenuItem> {
    const restaurant = await this.assertRestaurantMutationAccess(restaurantId, actor)
    const category = await this.getCategoryForRestaurant(dto.categoryId, restaurant.id)

    const item = this.menuItemRepository.create(
      this.menuRestaurantGuardService.createScopedPayload(
        {
          categoryId: category.id,
          name: dto.name,
          description: dto.description ?? null,
          price: dto.price,
          image: dto.image ?? null,
          isActive: true,
          sortOrder: dto.sortOrder ?? 0
        },
        restaurant.id
      )
    )

    return this.menuItemRepository.save(item)
  }

  async getRestaurantItems(
    restaurantId: string,
    actor: AuthenticatedRequestUser | undefined
  ): Promise<MenuItem[]> {
    const restaurant = await this.assertRestaurantAccess(restaurantId, actor)

    return applyMenuItemSorting(
      this.menuRestaurantGuardService
        .buildScopedQuery(this.menuItemRepository, 'item', restaurant.id)
        .leftJoinAndSelect('item.category', 'category'),
      'item'
    ).getMany()
  }

  async updateItem(
    restaurantId: string,
    itemId: string,
    dto: UpdateMenuItemDto,
    actor: AuthenticatedRequestUser | undefined
  ): Promise<MenuItem> {
    const item = await this.getItemForRestaurantActor(
      itemId,
      restaurantId,
      actor,
      'mutation'
    )

    if (dto.categoryId !== undefined) {
      const category = await this.getCategoryForRestaurant(dto.categoryId, item.restaurantId)
      item.categoryId = category.id
    }

    if (dto.name !== undefined) {
      item.name = dto.name
    }

    if (dto.description !== undefined) {
      item.description = dto.description
    }

    if (dto.price !== undefined) {
      item.price = dto.price
    }

    if (dto.image !== undefined) {
      item.image = dto.image
    }

    if (dto.isActive !== undefined) {
      item.isActive = dto.isActive
    }

    if (dto.sortOrder !== undefined) {
      item.sortOrder = dto.sortOrder
    }

    return this.menuItemRepository.save(item)
  }

  async deleteItem(
    restaurantId: string,
    itemId: string,
    actor: AuthenticatedRequestUser | undefined
  ): Promise<void> {
    const item = await this.getItemForRestaurantActor(
      itemId,
      restaurantId,
      actor,
      'mutation'
    )

    // MVP uses an explicit hard delete for menu items.
    await this.menuItemRepository.remove(item)
  }

  private async assertRestaurantAccess(
    restaurantId: string,
    actor: AuthenticatedRequestUser | undefined
  ): Promise<Restaurant> {
    return this.menuRestaurantGuardService.requireRestaurantAccess(
      restaurantId,
      actor,
      this.createHttpError
    )
  }

  private async assertRestaurantMutationAccess(
    restaurantId: string,
    actor: AuthenticatedRequestUser | undefined
  ): Promise<Restaurant> {
    return this.menuRestaurantGuardService.requireRestaurantMutationAccess(
      restaurantId,
      actor,
      this.createHttpError
    )
  }

  private async getItemForRestaurantActor(
    itemId: string,
    restaurantId: string,
    actor: AuthenticatedRequestUser | undefined,
    access: 'read' | 'mutation' = 'read'
  ): Promise<MenuItem> {
    const normalizedItemId = this.normalizeId(itemId, 'Menu item id is required')
    const restaurant =
      access === 'mutation'
        ? await this.assertRestaurantMutationAccess(restaurantId, actor)
        : await this.assertRestaurantAccess(restaurantId, actor)
    const item = await this.menuItemRepository.findOne({
      where: {
        id: normalizedItemId
      }
    })

    if (!item) {
      throw new MenuItemNotFoundError()
    }

    if (item.restaurantId !== restaurant.id) {
      throw new MenuItemRestaurantMismatchError()
    }

    return item
  }

  private async getCategoryForRestaurant(
    categoryId: string,
    restaurantId: string
  ): Promise<MenuCategory> {
    try {
      return await this.menuCategoriesService.getCategoryForRestaurant(
        categoryId,
        restaurantId
      )
    } catch (error) {
      if (error instanceof MenuCategoryNotFoundError) {
        throw new MenuItemCategoryNotFoundError()
      }

      if (error instanceof MenuCategoryRestaurantMismatchError) {
        throw new MenuItemCategoryRestaurantMismatchError()
      }

      throw error
    }
  }

  async getItemForRestaurant(itemId: string, restaurantId: string): Promise<MenuItem> {
    const normalizedItemId = this.normalizeId(itemId, 'Menu item id is required')
    const normalizedRestaurantId = this.normalizeId(
      restaurantId,
      'Restaurant id is required'
    )
    const item = await this.menuItemRepository.findOne({
      where: {
        id: normalizedItemId
      }
    })

    if (!item) {
      throw new MenuItemNotFoundError()
    }

    if (item.restaurantId !== normalizedRestaurantId) {
      throw new MenuItemRestaurantMismatchError()
    }

    return item
  }

  private normalizeId(value: string, errorMessage: string): string {
    const normalizedValue = value.trim()

    if (!normalizedValue) {
      if (errorMessage === 'Menu item id is required') {
        throw new MenuItemIdRequiredError()
      }

      if (errorMessage === 'Category id is required') {
        throw new MenuItemCategoryIdRequiredError()
      }

      throw new MenuItemsHttpError(400, errorMessage)
    }

    return normalizedValue
  }

  private createHttpError(error: unknown): MenuItemsHttpError {
    if (error instanceof MenuItemsHttpError) {
      return error
    }

    if (error instanceof MenuDomainError) {
      return new MenuItemsHttpError(error.statusCode, error.message, error.code)
    }

    return new MenuItemsHttpError(500, 'Failed to validate menu item access')
  }
}
