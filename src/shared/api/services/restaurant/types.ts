import type { Pagination } from '@/shared/lib/types/pagination'

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
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type RestouranstsResponse = {
  pagination: Pagination
  items: Restaurant[]
}

export type CreateRestaurantPayload = {
  name: string
  slug?: string
  phone: string
  address: string
  description: string
  email?: string
  city?: string
  logo?: string
  preview?: string
  logoFile?: File
  previewFile?: File
  deliveryTime?: number
  deliveryConditions?: string
  cuisine?: string[]
  phones?: string[]
  workSchedule?: Array<{
    day: string
    open: string
    close: string
  }>
}

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
  isActive?: boolean
  page?: number
  limit?: number
}
