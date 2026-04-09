import { RestaurantModerationStatus } from '@/shared/api/services/restaurant/types'
import type { RestaurantsListParams } from '@/shared/api/services/restaurant/types'
import { UserRole } from '@/shared/api/services/auth/types'

export const restauranstsQueryKeys = {
  all: (params?: RestaurantsListParams) =>
    params ? ['restaurants', params] : ['restaurants']
}

export const RESTAURANT_MODERATION_STATUS_META: Record<
  RestaurantModerationStatus,
  { label: string; color: string }
> = {
  [RestaurantModerationStatus.DRAFT]: { label: 'Черновик', color: 'gray' },
  [RestaurantModerationStatus.PENDING_APPROVAL]: {
    label: 'На модерации',
    color: 'yellow'
  },
  [RestaurantModerationStatus.ACTIVE]: { label: 'Одобрен', color: 'green' },
  [RestaurantModerationStatus.CHANGES_REQUIRED]: {
    label: 'Необходимы изменения',
    color: 'orange'
  },
  [RestaurantModerationStatus.REJECTED]: { label: 'Отклонен', color: 'red' },
  [RestaurantModerationStatus.BLOCKED]: {
    label: 'Заблокирован',
    color: 'grape'
  },
  [RestaurantModerationStatus.ARCHIVED]: { label: 'Архив', color: 'dark' }
}

export const RESTAURANT_EDITABLE_STATUSES: readonly RestaurantModerationStatus[] =
  [
    RestaurantModerationStatus.DRAFT,
    RestaurantModerationStatus.CHANGES_REQUIRED,
    RestaurantModerationStatus.ACTIVE
  ]

export const RESTAURANT_DELETABLE_STATUSES: readonly RestaurantModerationStatus[] =
  [
    RestaurantModerationStatus.DRAFT,
    RestaurantModerationStatus.CHANGES_REQUIRED,
    RestaurantModerationStatus.REJECTED
  ]

export const RESTAURANT_SUBMITTABLE_STATUSES: readonly RestaurantModerationStatus[] =
  [
    RestaurantModerationStatus.DRAFT,
    RestaurantModerationStatus.CHANGES_REQUIRED
  ]

export const RESTAURANT_ARCHIVABLE_BY_SYSTEM_OWNER_STATUSES: readonly RestaurantModerationStatus[] =
  [RestaurantModerationStatus.ACTIVE, RestaurantModerationStatus.BLOCKED]

export const RESTAURANT_ARCHIVABLE_BY_CLIENT_STATUSES: readonly RestaurantModerationStatus[] =
  [RestaurantModerationStatus.ACTIVE]

export const DEFAULT_RESTAURANT_STATUS_BY_ROLE: Partial<
  Record<UserRole, RestaurantModerationStatus>
> = {
  [UserRole.SYSTEM_OWNER]: RestaurantModerationStatus.PENDING_APPROVAL
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
