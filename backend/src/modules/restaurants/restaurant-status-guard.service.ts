import { RestaurantStatus } from './enums/restaurant-status.enum.js'
import type { Restaurant } from './entities/restaurant.entity.js'
import { RestaurantsHttpError } from './restaurants.errors.js'

const OWNER_EDITABLE_RESTAURANT_STATUSES = new Set<RestaurantStatus>([
  RestaurantStatus.DRAFT,
  RestaurantStatus.CHANGES_REQUIRED,
  RestaurantStatus.ACTIVE
])

type RestaurantStatusSnapshot = Pick<Restaurant, 'status' | 'isActive'>

export class RestaurantStatusGuardService {
  canOwnerEdit(status: RestaurantStatus): boolean {
    return OWNER_EDITABLE_RESTAURANT_STATUSES.has(status)
  }

  assertOwnerCanEdit(
    status: RestaurantStatus,
    resourceLabel = 'Restaurant'
  ): void {
    if (this.canOwnerEdit(status)) {
      return
    }

    throw new RestaurantsHttpError(
      409,
      `${resourceLabel} cannot be updated from status ${status}`
    )
  }

  isPubliclyVisible(restaurant: RestaurantStatusSnapshot): boolean {
    return restaurant.status === RestaurantStatus.ACTIVE && restaurant.isActive
  }

  assertPubliclyVisible(
    restaurant: RestaurantStatusSnapshot,
    errorMessage = 'Restaurant is not active'
  ): void {
    if (this.isPubliclyVisible(restaurant)) {
      return
    }

    throw new RestaurantsHttpError(409, errorMessage)
  }
}
