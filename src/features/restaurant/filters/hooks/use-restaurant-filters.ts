import { useCallback } from 'react'
import { useQueryParams } from '@/shared/lib/hooks/use-query-params'
import type { QueryParamConfig } from '@/shared/lib/query-string'
import { RESTAURANT_STATUS_VALUES } from '@/entities/restaurant'

const RESTAURANT_FILTER_QUERY_KEYS = {
  search: 'search',
  status: 'status'
} as const

export type RestaurantStatusFilter = (typeof RESTAURANT_STATUS_VALUES)[number]

const DEFAULT_RESTAURANT_STATUS_FILTER: RestaurantStatusFilter = 'all'

type RestaurantFiltersQuery = {
  search: string
  status: RestaurantStatusFilter
}

const isRestaurantStatusFilter = (
  value: string
): value is RestaurantStatusFilter =>
  RESTAURANT_STATUS_VALUES.includes(value as RestaurantStatusFilter)

const restaurantFiltersQueryConfig: QueryParamConfig<RestaurantFiltersQuery> = {
  search: {
    parse: (value) => value?.trim() ?? '',
    serialize: (value) => value.trim() || undefined
  },
  status: {
    parse: (value) => {
      const normalizedValue = value ?? ''

      return isRestaurantStatusFilter(normalizedValue)
        ? normalizedValue
        : DEFAULT_RESTAURANT_STATUS_FILTER
    },
    serialize: (value) =>
      value === DEFAULT_RESTAURANT_STATUS_FILTER ? undefined : value
  }
}

export function useRestaurantFilters() {
  const { params, setParams } = useQueryParams(restaurantFiltersQueryConfig)
  const hasActiveFilters =
    Boolean(params.search) || params.status !== DEFAULT_RESTAURANT_STATUS_FILTER

  const setSearch = useCallback(
    (value: string) => {
      setParams({ [RESTAURANT_FILTER_QUERY_KEYS.search]: value })
    },
    [setParams]
  )

  const setStatus = useCallback(
    (value: string | null) => {
      const normalizedValue = value ?? ''
      const nextStatus = isRestaurantStatusFilter(normalizedValue)
        ? normalizedValue
        : DEFAULT_RESTAURANT_STATUS_FILTER

      setParams({ [RESTAURANT_FILTER_QUERY_KEYS.status]: nextStatus })
    },
    [setParams]
  )

  const resetFilters = useCallback(() => {
    setParams({
      [RESTAURANT_FILTER_QUERY_KEYS.search]: '',
      [RESTAURANT_FILTER_QUERY_KEYS.status]: DEFAULT_RESTAURANT_STATUS_FILTER
    })
  }, [setParams])

  return {
    ...params,
    hasActiveFilters,
    resetFilters,
    setSearch,
    setStatus
  }
}
