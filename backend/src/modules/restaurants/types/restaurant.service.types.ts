import type { Restaurant } from '../entities/restaurant.entity.js'
import type { RestaurantRole } from '../enums/restaurant-role.enum.js'
import type { RestaurantStatus } from '../enums/restaurant-status.enum.js'
import type { AssignRestaurantManagerDto } from '../dto/assign-restaurant-manager.dto.js'
import type { CreateRestaurantDto } from '../dto/create-restaurant.dto.js'
import type { UpdateRestaurantDto } from '../dto/update-restaurant.dto.js'
import type { UserRole } from '../../users/enums/user-role.enum.js'

export type NormalizedCreateRestaurantInput = CreateRestaurantDto
export type UpdateRestaurantInput = UpdateRestaurantDto
export type AssignRestaurantManagerInput = AssignRestaurantManagerDto

export interface RestaurantMembershipUserDto {
  id: string
  firstName: string
  lastName: string
  phone: string
  email: string
  status: string
  role: UserRole
  isActive: boolean
  createdAt: Date
}

export interface RestaurantMembershipDto {
  id: string
  restaurantId: string
  userId: string
  role: RestaurantRole
  isActive: boolean
  createdAt: Date
  user: RestaurantMembershipUserDto
}

export interface CreateRestaurantResultDto {
  restaurant: Restaurant
  membership: RestaurantMembershipDto
}

export interface AssignManagerResultDto {
  membership: RestaurantMembershipDto
  created: boolean
}

export interface RestaurantPaginationDto {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface PaginatedRestaurantsDto {
  items: Restaurant[]
  pagination: RestaurantPaginationDto
}

export interface GetAccessibleRestaurantsOptions {
  includeInactiveMemberships?: boolean
  page?: number
  limit?: number
  search?: string
  name?: string
  city?: string
  slug?: string
  status?: RestaurantStatus
  isActive?: boolean
}

export interface GetPublicRestaurantsOptions {
  page?: number
  limit?: number
  search?: string
  name?: string
  city?: string
  slug?: string
  status?: RestaurantStatus
}
