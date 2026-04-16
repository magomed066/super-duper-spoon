import type { User } from '@/shared/api/services/auth/types'
import { UserRole } from '@/shared/api/services/auth/types'
import { ROUTES } from '@/shared/config/routes'

export enum PlatformPermission {
  VIEW_APPLICATIONS = 'view_applications',
  MANAGE_APPLICATIONS = 'manage_applications',
  VIEW_RESTAURANTS = 'view_restaurants',
  VIEW_MENU = 'view_menu',
  VIEW_ORDERS = 'view_orders',
  CREATE_RESTAURANT = 'create_restaurant',
  EDIT_RESTAURANT = 'edit_restaurant'
}

type RouteAccess = {
  permission: PlatformPermission
  fallbackRoute: string
}

export const PLATFORM_PERMISSIONS_BY_ROLE: Record<UserRole, PlatformPermission[]> = {
  [UserRole.SYSTEM_OWNER]: [
    PlatformPermission.VIEW_APPLICATIONS,
    PlatformPermission.MANAGE_APPLICATIONS,
    PlatformPermission.VIEW_RESTAURANTS
  ],
  [UserRole.CLIENT]: [
    PlatformPermission.VIEW_RESTAURANTS,
    PlatformPermission.VIEW_MENU,
    PlatformPermission.VIEW_ORDERS,
    PlatformPermission.CREATE_RESTAURANT,
    PlatformPermission.EDIT_RESTAURANT
  ],
  [UserRole.STAFF]: [
    PlatformPermission.VIEW_RESTAURANTS,
    PlatformPermission.VIEW_MENU,
    PlatformPermission.VIEW_ORDERS
  ]
}

export const PLATFORM_ROUTE_ACCESS: Partial<Record<string, RouteAccess>> = {
  [ROUTES.APPLICATIONS]: {
    permission: PlatformPermission.VIEW_APPLICATIONS,
    fallbackRoute: ROUTES.RESTAURANTS
  },
  [ROUTES.RESTAURANTS]: {
    permission: PlatformPermission.VIEW_RESTAURANTS,
    fallbackRoute: ROUTES.AUTH
  },
  [ROUTES.RESTAURANTS_DETAILS]: {
    permission: PlatformPermission.VIEW_RESTAURANTS,
    fallbackRoute: ROUTES.AUTH
  },
  [ROUTES.MENU]: {
    permission: PlatformPermission.VIEW_MENU,
    fallbackRoute: ROUTES.UNAUTHORIZED
  },
  [ROUTES.CATEGORIES]: {
    permission: PlatformPermission.VIEW_MENU,
    fallbackRoute: ROUTES.UNAUTHORIZED
  },
  [ROUTES.ORDERS]: {
    permission: PlatformPermission.VIEW_ORDERS,
    fallbackRoute: ROUTES.UNAUTHORIZED
  },
  [ROUTES.RESTAURANTS_CREATE]: {
    permission: PlatformPermission.CREATE_RESTAURANT,
    fallbackRoute: ROUTES.RESTAURANTS
  },
  [ROUTES.RESTAURANTS_EDIT]: {
    permission: PlatformPermission.EDIT_RESTAURANT,
    fallbackRoute: ROUTES.RESTAURANTS
  }
}

export const hasPlatformPermission = (
  user: User | null,
  permission: PlatformPermission
) => {
  if (!user) {
    return false
  }

  return PLATFORM_PERMISSIONS_BY_ROLE[user.role].includes(permission)
}

export const canAccessRoute = (user: User | null, route: string) => {
  const access = PLATFORM_ROUTE_ACCESS[route]

  if (!access) {
    return true
  }

  return hasPlatformPermission(user, access.permission)
}

export const getRouteFallback = (route: string) => {
  return PLATFORM_ROUTE_ACCESS[route]?.fallbackRoute ?? ROUTES.AUTH
}

// Backward-compatible alias for existing UI checks. Restaurant membership checks
// must stay separate from platform permissions and should not be added here.
export const hasPermission = hasPlatformPermission
export const AuthPermission = PlatformPermission
