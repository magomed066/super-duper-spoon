import type { Repository } from 'typeorm'

import { AppDataSource } from '../../database/data-source.js'
import { MenuCategory } from '../menu-categories/entities/menu-category.entity.js'
import { MenuItem } from '../menu-items/entities/menu-item.entity.js'
import { Restaurant } from '../restaurants/entities/restaurant.entity.js'
import { RestaurantUser } from '../restaurants/entities/restaurant-user.entity.js'
import type {
  MenuReadModelCategoryDto,
  MenuReadModelItemDto,
  RestaurantMenuReadModelDto
} from './dto/menu-read-model.dto.js'
import { MenuRestaurantGuardService } from './menu-restaurant-guard.service.js'
import { applyMenuCategorySorting, applyMenuItemSorting } from './menu-sort.helpers.js'
import {
  MenuDomainError,
  MenuRestaurantIdRequiredError,
  MenuHttpError
} from './menu.errors.js'

export class MenuService {
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

  async getPublicRestaurantMenu(
    restaurantId: string
  ): Promise<RestaurantMenuReadModelDto> {
    const restaurant = await this.menuRestaurantGuardService.requirePublicRestaurant(
      this.normalizeRestaurantId(restaurantId),
      this.createHttpError
    )

    const [categories, items] = await Promise.all([
      applyMenuCategorySorting(
        this.menuCategoryRepository
          .createQueryBuilder('category')
          .where('category.restaurantId = :restaurantId', {
            restaurantId: restaurant.id
          })
          .andWhere('category.isActive = :isActive', {
            isActive: true
          }),
        'category'
      ).getMany(),
      applyMenuItemSorting(
        this.menuItemRepository
          .createQueryBuilder('item')
          .innerJoin(
            MenuCategory,
            'category',
            [
              'category.id = item.categoryId',
              'category.restaurantId = item.restaurantId',
              'category.isActive = :activeCategory'
            ].join(' AND '),
            {
              activeCategory: true
            }
          )
          .where('item.restaurantId = :restaurantId', {
            restaurantId: restaurant.id
          })
          .andWhere('item.isActive = :activeItem', {
            activeItem: true
          }),
        'item'
      ).getMany()
    ])

    const itemsByCategoryId = new Map<string, MenuReadModelItemDto[]>()

    for (const item of items) {
      const categoryItems = itemsByCategoryId.get(item.categoryId) ?? []

      categoryItems.push({
        id: item.id,
        categoryId: item.categoryId,
        name: item.name,
        description: item.description,
        price: item.price,
        image: item.image,
        sortOrder: item.sortOrder
      })

      itemsByCategoryId.set(item.categoryId, categoryItems)
    }

    return {
      restaurantId: restaurant.id,
      categories: categories.map<MenuReadModelCategoryDto>((category) => ({
        id: category.id,
        name: category.name,
        description: category.description,
        sortOrder: category.sortOrder,
        items: itemsByCategoryId.get(category.id) ?? []
      }))
    }
  }

  private normalizeRestaurantId(restaurantId: string): string {
    const normalizedRestaurantId = restaurantId.trim()

    if (!normalizedRestaurantId) {
      throw new MenuRestaurantIdRequiredError()
    }

    return normalizedRestaurantId
  }

  private createHttpError(error: unknown): MenuHttpError {
    if (error instanceof MenuHttpError) {
      return error
    }

    if (error instanceof MenuDomainError) {
      return new MenuHttpError(error.statusCode, error.message, error.code)
    }

    return new MenuHttpError(500, 'Failed to read restaurant menu')
  }
}
