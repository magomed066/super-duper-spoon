import { Brackets } from 'typeorm'
import type { SelectQueryBuilder } from 'typeorm'

import { RestaurantStatus } from '../enums/restaurant-status.enum.js'
import type { Restaurant } from '../entities/restaurant.entity.js'
import type {
  GetAccessibleRestaurantsOptions,
  GetPublicRestaurantsOptions
} from '../types/restaurant.service.types.js'

export function applyRestaurantFilters(
  query: SelectQueryBuilder<Restaurant>,
  options: GetAccessibleRestaurantsOptions | GetPublicRestaurantsOptions
): void {
  if ('isActive' in options && options.isActive !== undefined) {
    query.andWhere('restaurant.isActive = :isActive', {
      isActive: options.isActive
    })
  }

  if (options.status) {
    query.andWhere('restaurant.status = :status', {
      status: options.status
    })
  }

  if (options.slug) {
    query.andWhere('restaurant.slug ILIKE :slug', {
      slug: `%${escapeLikePattern(options.slug)}%`
    })
  }

  if (options.name) {
    query.andWhere('restaurant.name ILIKE :name', {
      name: `%${escapeLikePattern(options.name)}%`
    })
  }

  if (options.city) {
    query.andWhere('restaurant.city ILIKE :city', {
      city: `%${escapeLikePattern(options.city)}%`
    })
  }

  if (options.search) {
    const searchTerm = `%${escapeLikePattern(options.search)}%`

    query.andWhere(
      new Brackets((searchQuery) => {
        searchQuery
          .where('restaurant.name ILIKE :search', {
            search: searchTerm
          })
          .orWhere('restaurant.slug ILIKE :search', {
            search: searchTerm
          })
          .orWhere('restaurant.city ILIKE :search', {
            search: searchTerm
          })
          .orWhere('restaurant.email ILIKE :search', {
            search: searchTerm
          })
          .orWhere('restaurant.phone ILIKE :search', {
            search: searchTerm
          })
          .orWhere('restaurant.address ILIKE :search', {
            search: searchTerm
          })
          .orWhere('restaurant.description ILIKE :search', {
            search: searchTerm
          })
      })
    )
  }
}

export function applyPublicVisibilityFilter(
  query: SelectQueryBuilder<Restaurant>
): void {
  query
    .andWhere('restaurant.status = :publicStatus', {
      publicStatus: RestaurantStatus.ACTIVE
    })
    .andWhere('restaurant.isActive = :isPubliclyActive', {
      isPubliclyActive: true
    })
}

export function isRestaurantPubliclyVisible(restaurant: Restaurant): boolean {
  return restaurant.status === RestaurantStatus.ACTIVE && restaurant.isActive
}

export function buildMembershipJoinCondition(
  includeInactiveMemberships: boolean
): string {
  const conditions = [
    'membership.restaurantId = restaurant.id',
    'membership.userId = :userId'
  ]

  if (!includeInactiveMemberships) {
    conditions.push('membership.isActive = true')
  }

  return conditions.join(' AND ')
}

function escapeLikePattern(value: string): string {
  return value.replace(/[\\%_]/g, '\\$&')
}
