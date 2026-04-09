import type { ObjectLiteral, SelectQueryBuilder } from 'typeorm'

export interface RestaurantScoped {
  restaurantId: string
}

export class RestaurantScopeError extends Error {
  constructor(message = 'Restaurant id is required') {
    super(message)
    this.name = 'RestaurantScopeError'
  }
}

export const normalizeRestaurantScopeId = (restaurantId: string): string =>
  restaurantId.trim()

export const assertRestaurantScopeId = (restaurantId: string): string => {
  const normalizedRestaurantId = normalizeRestaurantScopeId(restaurantId)

  if (!normalizedRestaurantId) {
    throw new RestaurantScopeError()
  }

  return normalizedRestaurantId
}

/**
 * Helper for create flows in future restaurant-scoped modules.
 * The restaurant id should come from access context or route params, not from untrusted payloads.
 */
export const withRestaurantScope = <T extends object>(
  payload: T,
  restaurantId: string
): T & RestaurantScoped => ({
  ...payload,
  restaurantId: assertRestaurantScopeId(restaurantId)
})

/**
 * Helper for query builders in future restaurant-scoped modules.
 * Always apply tenant scope at the root entity alias before loading related data.
 */
export const applyRestaurantScope = <T extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<T>,
  alias: string,
  restaurantId: string
): SelectQueryBuilder<T> =>
  queryBuilder.andWhere(`${alias}.restaurantId = :restaurantId`, {
    restaurantId: assertRestaurantScopeId(restaurantId)
  })
