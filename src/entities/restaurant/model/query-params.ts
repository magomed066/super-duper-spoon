import type { QueryParamConfig } from '@/shared/lib/query-string'
import { createUseQueryParams } from '@/shared/lib/hooks/use-query-params'

export type RestaurantQueryParams = {
  restaurantId: string
}

export const restaurantQueryUrlConfig: QueryParamConfig<RestaurantQueryParams> =
  {
    restaurantId: {
      parse: (value) => value?.trim() ?? '',
      serialize: (value) => value.trim() || undefined
    }
  }

export const useRestaurantQueryParams =
  createUseQueryParams(restaurantQueryUrlConfig)
