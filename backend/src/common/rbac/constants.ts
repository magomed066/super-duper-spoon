import { RestaurantRole } from '../../modules/restaurants/enums/restaurant-role.enum.js'
import { UserRole } from '../../modules/users/enums/user-role.enum.js'

export const PLATFORM_USER_ROLES = [
  UserRole.SYSTEM_OWNER,
  UserRole.CLIENT,
  UserRole.STAFF
] as const satisfies readonly UserRole[]

export const RESTAURANT_ROLES = [
  RestaurantRole.OWNER,
  RestaurantRole.MANAGER
] as const satisfies readonly RestaurantRole[]

export const RESTAURANT_MEMBERSHIP_PLATFORM_ROLES = [
  UserRole.CLIENT,
  UserRole.STAFF
] as const satisfies readonly UserRole[]

export const RESTAURANT_CREATION_PLATFORM_ROLES = [
  UserRole.SYSTEM_OWNER,
  UserRole.CLIENT
] as const satisfies readonly UserRole[]

export const RESTAURANT_MANAGEMENT_ROLES = [
  RestaurantRole.OWNER,
  RestaurantRole.MANAGER
] as const satisfies readonly RestaurantRole[]

export const RESTAURANT_OWNER_ONLY_ROLES = [
  RestaurantRole.OWNER
] as const satisfies readonly RestaurantRole[]

export type PlatformUserRole = (typeof PLATFORM_USER_ROLES)[number]
export type RestaurantMembershipRole = (typeof RESTAURANT_ROLES)[number]
