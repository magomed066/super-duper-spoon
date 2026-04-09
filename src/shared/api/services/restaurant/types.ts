import type { Pagination } from '@/shared/lib/types/pagination'

export type RestaurantModerationStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'ACTIVE'
  | 'CHANGES_REQUIRED'
  | 'REJECTED'
  | 'BLOCKED'
  | 'ARCHIVED'

export type RestaurantListStatusFilter = RestaurantModerationStatus

export type Restaurant = {
  id: string
  name: string
  slug: string
  cuisine: string[]
  email: string
  phones: string[]
  city: string
  logo: string
  preview: string
  workSchedule: Array<{
    day: string
    open: string
    close: string
  }>
  deliveryTime: number
  deliveryConditions: string
  description: string | null
  phone: string | null
  address: string | null
  status: RestaurantModerationStatus
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type RestouranstsResponse = {
  pagination: Pagination
  items: Restaurant[]
}

export type RestaurantMutableFields = {
  name: string
  slug?: string
  cuisine?: string[]
  email?: string
  phones?: string[]
  city?: string
  logo?: string
  preview?: string
  workSchedule?: Array<{
    day: string
    open: string
    close: string
  }>
  deliveryTime?: number
  deliveryConditions?: string
  description: string
  phone: string
  address: string
}

export type CreateRestaurantPayload = RestaurantMutableFields & {
  logoFile?: File
  previewFile?: File
}

export type UpdateRestaurantPayload = Partial<
  RestaurantMutableFields & {
    logoFile?: File
    previewFile?: File
  }
> &
  Partial<Pick<Restaurant, 'isActive'>>

export type CreateRestaurantResponse = {
  restaurant: Restaurant
  membership: {
    id: string
    restaurantId: string
    userId: string
    role: string
    isActive: boolean
    createdAt: string
  }
}

export type RestaurantsListParams = {
  search?: string
  status?: RestaurantListStatusFilter
  isActive?: boolean
  page?: number
  limit?: number
}
