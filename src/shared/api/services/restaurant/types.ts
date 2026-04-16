import type { Pagination } from '@/shared/lib/types/pagination'

export enum RestaurantModerationStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  ACTIVE = 'ACTIVE',
  CHANGES_REQUIRED = 'CHANGES_REQUIRED',
  REJECTED = 'REJECTED',
  BLOCKED = 'BLOCKED',
  ARCHIVED = 'ARCHIVED'
}

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

export type RestaurantMembershipUser = {
  id: string
  firstName: string
  lastName: string
  phone: string
  email: string
  status: string
  role: string
  isActive: boolean
  createdAt: string
}

export type RestaurantMembership = {
  id: string
  restaurantId: string
  userId: string
  role: string
  isActive: boolean
  createdAt: string
  user: RestaurantMembershipUser
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
}

export type UpdateRestaurantPayload = Partial<
  RestaurantMutableFields
> &
  Partial<Pick<Restaurant, 'isActive'>>

export type CreateRestaurantResponse = {
  restaurant: Restaurant
  membership: RestaurantMembership
}

export type RestaurantsListParams = {
  search?: string
  status?: RestaurantListStatusFilter
  isActive?: boolean
  page?: number
  limit?: number
}

export type AssignRestaurantManagerPayload = {
  userId: string
}
