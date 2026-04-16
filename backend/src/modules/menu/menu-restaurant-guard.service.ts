import type {
  ObjectLiteral,
  Repository,
  SelectQueryBuilder
} from 'typeorm'

import type { RestaurantScoped } from '../../common/restaurant-scope/index.js'
import { AppDataSource } from '../../database/data-source.js'
import type { AuthenticatedRequestUser } from '../auth/types/auth.types.js'
import { Restaurant } from '../restaurants/entities/restaurant.entity.js'
import { RestaurantUser } from '../restaurants/entities/restaurant-user.entity.js'
import { RestaurantsHttpError } from '../restaurants/restaurants.errors.js'
import { RestaurantStatusGuardService } from '../restaurants/restaurant-status-guard.service.js'
import { RestaurantTenantService } from '../restaurants/restaurant-tenant.service.js'
import {
  MenuDomainError,
  MenuMutationNotAllowedError,
  MenuRestaurantAccessForbiddenError,
  MenuRestaurantIdRequiredError,
  MenuRestaurantNotFoundError,
  MenuRestaurantNotPublicError
} from './menu.errors.js'

type MenuScopedErrorFactory<TError extends Error> = (error: unknown) => TError

export class MenuRestaurantGuardService {
  private readonly restaurantTenantService: RestaurantTenantService
  private readonly restaurantRepository: Repository<Restaurant>
  private readonly restaurantStatusGuardService: RestaurantStatusGuardService

  constructor(
    restaurantRepository: Repository<Restaurant> = AppDataSource.getRepository(Restaurant),
    restaurantUserRepository: Repository<RestaurantUser> = AppDataSource.getRepository(
      RestaurantUser
    )
  ) {
    this.restaurantRepository = restaurantRepository
    this.restaurantTenantService = new RestaurantTenantService(
      restaurantRepository,
      restaurantUserRepository
    )
    this.restaurantStatusGuardService = new RestaurantStatusGuardService()
  }

  async requireRestaurantAccess<TError extends Error>(
    restaurantId: string,
    actor: AuthenticatedRequestUser | undefined,
    createError: MenuScopedErrorFactory<TError>
  ): Promise<Restaurant> {
    try {
      return await this.restaurantTenantService.getAccessibleRestaurant(restaurantId, actor)
    } catch (error) {
      throw this.mapRestaurantAccessError(error, createError)
    }
  }

  async requireRestaurantMutationAccess<TError extends Error>(
    restaurantId: string,
    actor: AuthenticatedRequestUser | undefined,
    createError: MenuScopedErrorFactory<TError>
  ): Promise<Restaurant> {
    try {
      return await this.restaurantTenantService.getRestaurantForMutation(
        restaurantId,
        actor,
        'update'
      )
    } catch (error) {
      throw this.mapRestaurantAccessError(error, createError)
    }
  }

  async requirePublicRestaurant<TError extends Error>(
    restaurantId: string,
    createError: MenuScopedErrorFactory<TError>
  ): Promise<Restaurant> {
    try {
      const normalizedRestaurantId = restaurantId.trim()

      if (!normalizedRestaurantId) {
        throw createError(new MenuRestaurantIdRequiredError())
      }

      const restaurant = await this.restaurantRepository.findOneBy({
        id: normalizedRestaurantId
      })

      if (!restaurant) {
        throw createError(new MenuRestaurantNotFoundError())
      }

      this.restaurantStatusGuardService.assertPubliclyVisible(restaurant)

      return restaurant
    } catch (error) {
      throw this.mapRestaurantAccessError(error, createError)
    }
  }

  createScopedPayload<T extends object>(
    payload: T,
    restaurantId: string
  ): T & RestaurantScoped {
    return this.restaurantTenantService.createScopedPayload(payload, restaurantId)
  }

  buildScopedQuery<T extends ObjectLiteral & RestaurantScoped>(
    repository: Repository<T>,
    alias: string,
    restaurantId: string
  ): SelectQueryBuilder<T> {
    return this.restaurantTenantService.buildScopedQuery(repository, alias, restaurantId)
  }

  private mapRestaurantAccessError<TError extends Error>(
    error: unknown,
    createError: MenuScopedErrorFactory<TError>
  ): TError {
    if (error instanceof MenuDomainError) {
      return createError(error)
    }

    if (error instanceof RestaurantsHttpError) {
      if (error.statusCode === 400 && error.message === 'Restaurant id is required') {
        return createError(new MenuRestaurantIdRequiredError())
      }

      if (error.statusCode === 404 && error.message === 'Restaurant not found') {
        return createError(new MenuRestaurantNotFoundError())
      }

      if (error.statusCode === 403 && error.message === 'Access denied') {
        return createError(new MenuRestaurantAccessForbiddenError())
      }

      if (
        error.statusCode === 409 &&
        error.message.startsWith('Restaurant cannot be updated from status ')
      ) {
        const status = error.message.slice('Restaurant cannot be updated from status '.length)

        return createError(new MenuMutationNotAllowedError(status))
      }

      if (error.statusCode === 409 && error.message === 'Restaurant is not active') {
        return createError(new MenuRestaurantNotPublicError())
      }
    }

    return createError(new MenuDomainError(500, 'MENU_ACCESS_ERROR', 'Failed to validate restaurant access'))
  }
}
