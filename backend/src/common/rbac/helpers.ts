import { RestaurantRole } from '../../modules/restaurants/enums/restaurant-role.enum.js'
import { UserRole } from '../../modules/users/enums/user-role.enum.js'
import {
  PLATFORM_USER_ROLES,
  RESTAURANT_CREATION_PLATFORM_ROLES,
  RESTAURANT_MEMBERSHIP_PLATFORM_ROLES,
  RESTAURANT_ROLES,
  type PlatformUserRole,
  type RestaurantMembershipRole
} from './constants.js'

const platformUserRoleSet = new Set<PlatformUserRole>(PLATFORM_USER_ROLES)
const restaurantMembershipRoleSet = new Set<RestaurantMembershipRole>(RESTAURANT_ROLES)
const restaurantMembershipPlatformRoleSet = new Set<UserRole>(
  RESTAURANT_MEMBERSHIP_PLATFORM_ROLES
)
const restaurantCreationPlatformRoleSet = new Set<UserRole>(
  RESTAURANT_CREATION_PLATFORM_ROLES
)

export const isPlatformUserRole = (role: UserRole): role is PlatformUserRole =>
  platformUserRoleSet.has(role as PlatformUserRole)

export const hasPlatformRole = (
  role: UserRole,
  allowedRoles: readonly PlatformUserRole[]
): boolean => isPlatformUserRole(role) && allowedRoles.includes(role)

export const isSystemOwner = (role: UserRole): boolean => role === UserRole.SYSTEM_OWNER

export const canUseRestaurantMembership = (role: UserRole): boolean =>
  restaurantMembershipPlatformRoleSet.has(role)

export const canCreateRestaurant = (role: UserRole): boolean =>
  restaurantCreationPlatformRoleSet.has(role)

export const isRestaurantMembershipRole = (
  role: RestaurantRole
): role is RestaurantMembershipRole =>
  restaurantMembershipRoleSet.has(role as RestaurantMembershipRole)

export const hasRestaurantRole = (
  role: RestaurantRole,
  allowedRoles: readonly RestaurantMembershipRole[]
): boolean => isRestaurantMembershipRole(role) && allowedRoles.includes(role)
