import type {
  ObjectLiteral,
  Repository,
  SelectQueryBuilder
} from 'typeorm'

import {
  applyRestaurantScope,
  assertRestaurantScopeId,
  withRestaurantScope,
  type RestaurantScoped
} from '../../common/restaurant-scope/index.js'
import { AppDataSource } from '../../database/data-source.js'
import type { AuthenticatedRequestUser } from '../auth/types/auth.types.js'
import { UserRole } from '../users/enums/user-role.enum.js'
import { RestaurantAccessService } from './restaurant-access.service.js'
import { Restaurant } from './entities/restaurant.entity.js'
import { RestaurantUser } from './entities/restaurant-user.entity.js'
import { RestaurantsHttpError } from './restaurant.service.js'

export type RestaurantTenantAction = 'read' | 'update' | 'delete' | 'manage'

/**
 * Tenant boundary for restaurant-scoped modules.
 * Future modules should verify access here first, then apply restaurant scope
 * to every repository query that returns or mutates restaurant-owned data.
 */
export class RestaurantTenantService {
  private readonly restaurantRepository: Repository<Restaurant>
  private readonly restaurantAccessService: RestaurantAccessService

  constructor(
    restaurantRepository: Repository<Restaurant> = AppDataSource.getRepository(Restaurant),
    restaurantUserRepository: Repository<RestaurantUser> = AppDataSource.getRepository(
      RestaurantUser
    )
  ) {
    this.restaurantRepository = restaurantRepository
    this.restaurantAccessService = new RestaurantAccessService(
      restaurantRepository,
      restaurantUserRepository
    )
  }

  async getAccessibleRestaurant(
    restaurantId: string,
    currentUser: AuthenticatedRequestUser | undefined
  ): Promise<Restaurant> {
    const restaurant = await this.assertRestaurantAccess(
      restaurantId,
      currentUser,
      'read'
    )

    return restaurant
  }

  async getRestaurantForMutation(
    restaurantId: string,
    currentUser: AuthenticatedRequestUser | undefined,
    action: Exclude<RestaurantTenantAction, 'read' | 'manage'>
  ): Promise<Restaurant> {
    return this.assertRestaurantAccess(restaurantId, currentUser, action)
  }

  async assertRestaurantOwnerAccess(
    restaurantId: string,
    currentUser: AuthenticatedRequestUser | undefined
  ): Promise<string> {
    const restaurant = await this.assertRestaurantAccess(
      restaurantId,
      currentUser,
      'manage'
    )

    return restaurant.id
  }

  createScopedPayload<T extends object>(
    payload: T,
    restaurantId: string
  ): T & RestaurantScoped {
    return withRestaurantScope(payload, restaurantId)
  }

  buildScopedQuery<T extends ObjectLiteral & RestaurantScoped>(
    repository: Repository<T>,
    alias: string,
    restaurantId: string
  ): SelectQueryBuilder<T> {
    return applyRestaurantScope(
      repository.createQueryBuilder(alias),
      alias,
      assertRestaurantScopeId(restaurantId)
    )
  }

  async assertRestaurantAccess(
    restaurantId: string,
    currentUser: AuthenticatedRequestUser | undefined,
    action: RestaurantTenantAction = 'read'
  ): Promise<Restaurant> {
    if (!currentUser) {
      throw new RestaurantsHttpError(401, 'User is not authenticated')
    }

    const normalizedRestaurantId = this.normalizeRestaurantId(restaurantId)
    const restaurant = await this.restaurantRepository.findOne({
      where: {
        id: normalizedRestaurantId
      }
    })

    if (!restaurant) {
      throw new RestaurantsHttpError(404, 'Restaurant not found')
    }

    const hasAccess = await this.resolveAccess(
      currentUser.id,
      currentUser.role,
      normalizedRestaurantId,
      action
    )

    if (!hasAccess) {
      throw new RestaurantsHttpError(403, 'Access denied')
    }

    return restaurant
  }

  private normalizeRestaurantId(restaurantId: string): string {
    try {
      return assertRestaurantScopeId(restaurantId)
    } catch {
      throw new RestaurantsHttpError(400, 'Restaurant id is required')
    }
  }

  private resolveAccess(
    userId: string,
    systemRole: UserRole,
    restaurantId: string,
    action: RestaurantTenantAction
  ): Promise<boolean> {
    if (action === 'read') {
      return this.restaurantAccessService.hasRestaurantAccess(
        userId,
        systemRole,
        restaurantId
      )
    }

    if (action === 'update') {
      return this.restaurantAccessService.canUpdateRestaurant(
        userId,
        systemRole,
        restaurantId
      )
    }

    if (action === 'delete') {
      return this.restaurantAccessService.canDeleteRestaurant(
        userId,
        systemRole,
        restaurantId
      )
    }

    if (systemRole === UserRole.SYSTEM_OWNER) {
      return Promise.resolve(true)
    }

    return this.restaurantAccessService.isRestaurantOwner(userId, restaurantId)
  }
}
