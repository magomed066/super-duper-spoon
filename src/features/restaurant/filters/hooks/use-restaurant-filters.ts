import { useCallback } from 'react'
import { useLocation } from 'react-router'
import { useQueryParams } from '@/shared/lib/hooks/use-query-params'
import type { QueryParamConfig } from '@/shared/lib/query-string'
import {
  DEFAULT_RESTAURANT_STATUS_BY_ROLE,
  RESTAURANT_STATUS_VALUES
} from '@/entities/restaurant'
import type { RestaurantListStatusFilter } from '@/shared/api/services/restaurant/types'
import { useAuthStore } from '@/entities/auth'

const RESTAURANT_FILTER_QUERY_KEYS = {
  search: 'search',
  status: 'status'
} as const

export type RestaurantStatusFilter = 'all' | RestaurantListStatusFilter

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
  const location = useLocation()
  const user = useAuthStore((state) => state.user)
  const { params, setParams } = useQueryParams(restaurantFiltersQueryConfig)
  const hasExplicitStatus = new URLSearchParams(location.search).has(
    RESTAURANT_FILTER_QUERY_KEYS.status
  )
  const defaultStatus: RestaurantStatusFilter =
    (user?.role && DEFAULT_RESTAURANT_STATUS_BY_ROLE[user.role]) ??
    DEFAULT_RESTAURANT_STATUS_FILTER

  const status = hasExplicitStatus ? params.status : defaultStatus

  const hasActiveFilters =
    Boolean(params.search) || (hasExplicitStatus && status !== defaultStatus)

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
    status,
    hasActiveFilters,
    resetFilters,
    setSearch,
    setStatus
  }
}
