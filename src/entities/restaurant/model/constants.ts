import type { RestaurantsListParams } from '@/shared/api/services/restaurant/types'

export const restauranstsQueryKeys = {
  all: (params?: RestaurantsListParams) =>
    params ? ['restaurants', params] : ['restaurants']
}

export const RESTAURANT_STATUS_FILTERS = [
  { value: 'all', label: 'Все' },
  { value: 'active', label: 'Только активные' },
  { value: 'inactive', label: 'Только неактивные' }
]

export const RESTAURANT_STATUS_VALUES = ['all', 'active', 'inactive'] as const
