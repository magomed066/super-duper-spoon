import type { Repository } from 'typeorm'

import { AppDataSource } from '../../database/data-source.js'
import { applyMenuCategorySorting } from '../menu/menu-sort.helpers.js'
import { MenuRestaurantGuardService } from '../menu/menu-restaurant-guard.service.js'
import type { AuthenticatedRequestUser } from '../auth/types/auth.types.js'
import { MenuItem } from '../menu-items/entities/menu-item.entity.js'
import { Restaurant } from '../restaurants/entities/restaurant.entity.js'
import { RestaurantUser } from '../restaurants/entities/restaurant-user.entity.js'
import type { CreateMenuCategoryDto } from './dto/create-menu-category.dto.js'
import type { UpdateMenuCategoryDto } from './dto/update-menu-category.dto.js'
import { MenuCategory } from './entities/menu-category.entity.js'
import {
  MenuCategoriesHttpError,
  MenuCategoryIdRequiredError,
  MenuCategoryNotEmptyError,
  MenuCategoryNotFoundError
} from './menu-categories.errors.js'
import {
  MenuCategoryRestaurantMismatchError,
  MenuDomainError
} from '../menu/menu.errors.js'

export class MenuCategoriesService {
  private readonly menuCategoryRepository: Repository<MenuCategory>
  private readonly menuItemRepository: Repository<MenuItem>
  private readonly menuRestaurantGuardService: MenuRestaurantGuardService

  constructor(
    menuCategoryRepository: Repository<MenuCategory> = AppDataSource.getRepository(
      MenuCategory
    ),
    menuItemRepository: Repository<MenuItem> = AppDataSource.getRepository(MenuItem),
    restaurantRepository: Repository<Restaurant> = AppDataSource.getRepository(Restaurant),
    restaurantUserRepository: Repository<RestaurantUser> = AppDataSource.getRepository(
      RestaurantUser
    )
  ) {
    this.menuCategoryRepository = menuCategoryRepository
    this.menuItemRepository = menuItemRepository
    this.menuRestaurantGuardService = new MenuRestaurantGuardService(
      restaurantRepository,
      restaurantUserRepository
    )
  }

  async createCategory(
    restaurantId: string,
    dto: CreateMenuCategoryDto,
    actor: AuthenticatedRequestUser | undefined
  ): Promise<MenuCategory> {
    const restaurant = await this.assertRestaurantMutationAccess(restaurantId, actor)

    const category = this.menuCategoryRepository.create(
      this.menuRestaurantGuardService.createScopedPayload(
        {
          name: dto.name,
          description: dto.description ?? null,
          sortOrder: dto.sortOrder ?? 0,
          isActive: true
        },
        restaurant.id
      )
    )

    return this.menuCategoryRepository.save(category)
  }

  async getRestaurantCategories(
    restaurantId: string,
    actor: AuthenticatedRequestUser | undefined
  ): Promise<MenuCategory[]> {
    const restaurant = await this.assertRestaurantAccess(restaurantId, actor)

    return applyMenuCategorySorting(
      this.menuRestaurantGuardService.buildScopedQuery(
        this.menuCategoryRepository,
        'category',
        restaurant.id
      ),
      'category'
    ).getMany()
  }

  async updateCategory(
    restaurantId: string,
    categoryId: string,
    dto: UpdateMenuCategoryDto,
    actor: AuthenticatedRequestUser | undefined
  ): Promise<MenuCategory> {
    const category = await this.getCategoryForRestaurantActor(
      categoryId,
      restaurantId,
      actor,
      'mutation'
    )

    if (dto.name !== undefined) {
      category.name = dto.name
    }

    if (dto.description !== undefined) {
      category.description = dto.description
    }

    if (dto.sortOrder !== undefined) {
      category.sortOrder = dto.sortOrder
    }

    if (dto.isActive !== undefined) {
      category.isActive = dto.isActive
    }

    return this.menuCategoryRepository.save(category)
  }

  async deleteCategory(
    restaurantId: string,
    categoryId: string,
    actor: AuthenticatedRequestUser | undefined
  ): Promise<void> {
    const category = await this.getCategoryForRestaurantActor(
      categoryId,
      restaurantId,
      actor,
      'mutation'
    )

    const hasItems = await this.menuItemRepository.exists({
      where: {
        categoryId: category.id,
        restaurantId: category.restaurantId
      }
    })

    /**
     * Safer MVP behavior:
     * reject deletion when dependent menu items still exist instead of cascading
     * or silently reassigning data. This keeps menu integrity explicit until
     * product requirements for item archival/reassignment are defined.
     */
    if (hasItems) {
      throw new MenuCategoryNotEmptyError()
    }

    await this.menuCategoryRepository.remove(category)
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

  private async getCategoryForRestaurantActor(
    categoryId: string,
    restaurantId: string,
    actor: AuthenticatedRequestUser | undefined,
    access: 'read' | 'mutation' = 'read'
  ): Promise<MenuCategory> {
    const normalizedCategoryId = this.normalizeId(categoryId, 'Category id is required')
    const restaurant =
      access === 'mutation'
        ? await this.assertRestaurantMutationAccess(restaurantId, actor)
        : await this.assertRestaurantAccess(restaurantId, actor)

    const category = await this.menuCategoryRepository.findOne({
      where: {
        id: normalizedCategoryId
      }
    })

    if (!category) {
      throw new MenuCategoryNotFoundError()
    }

    if (category.restaurantId !== restaurant.id) {
      throw new MenuCategoryRestaurantMismatchError()
    }

    return category
  }

  async getCategoryForRestaurant(
    categoryId: string,
    restaurantId: string
  ): Promise<MenuCategory> {
    const normalizedCategoryId = this.normalizeId(categoryId, 'Category id is required')
    const normalizedRestaurantId = this.normalizeId(
      restaurantId,
      'Restaurant id is required'
    )

    const category = await this.menuCategoryRepository.findOne({
      where: {
        id: normalizedCategoryId
      }
    })

    if (!category) {
      throw new MenuCategoryNotFoundError()
    }

    if (category.restaurantId !== normalizedRestaurantId) {
      throw new MenuCategoryRestaurantMismatchError()
    }

    return category
  }

  private normalizeId(value: string, errorMessage: string): string {
    const normalizedValue = value.trim()

    if (!normalizedValue) {
      if (errorMessage === 'Category id is required') {
        throw new MenuCategoryIdRequiredError()
      }

      throw new MenuCategoriesHttpError(400, errorMessage)
    }

    return normalizedValue
  }

  private createHttpError(error: unknown): MenuCategoriesHttpError {
    if (error instanceof MenuCategoriesHttpError) {
      return error
    }

    if (error instanceof MenuDomainError) {
      return new MenuCategoriesHttpError(error.statusCode, error.message, error.code)
    }

    return new MenuCategoriesHttpError(500, 'Failed to validate menu category access')
  }
}
