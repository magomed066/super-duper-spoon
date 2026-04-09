import type {
  RestaurantModerationStatus,
  RestaurantsListParams
} from '@/shared/api/services/restaurant/types'

export const restauranstsQueryKeys = {
  all: (params?: RestaurantsListParams) =>
    params ? ['restaurants', params] : ['restaurants']
}

export const RESTAURANT_MODERATION_STATUS_META: Record<
  RestaurantModerationStatus,
  { label: string; color: string }
> = {
  DRAFT: { label: 'Черновик', color: 'gray' },
  PENDING_APPROVAL: { label: 'На модерации', color: 'yellow' },
  ACTIVE: { label: 'Одобрен', color: 'green' },
  CHANGES_REQUIRED: { label: 'Нужны правки', color: 'orange' },
  REJECTED: { label: 'Отклонен', color: 'red' },
  BLOCKED: { label: 'Заблокирован', color: 'grape' },
  ARCHIVED: { label: 'Архив', color: 'dark' }
}

export const RESTAURANT_STATUS_FILTERS = [
  { value: 'all', label: 'Все статусы' },
  ...Object.entries(RESTAURANT_MODERATION_STATUS_META).map(([value, meta]) => ({
    value,
    label: meta.label
  }))
]

export const RESTAURANT_STATUS_VALUES = [
  'all',
  ...Object.keys(RESTAURANT_MODERATION_STATUS_META)
] as const
