import type { User } from '@/shared/api/services/auth/types'
import { UserRole } from '@/shared/api/services/auth/types'
import { ROUTES } from '@/shared/config/routes'

export enum AuthPermission {
  VIEW_APPLICATIONS = 'view_applications',
  MANAGE_APPLICATIONS = 'manage_applications',
  VIEW_RESTAURANTS = 'view_restaurants'
}

type RouteAccess = {
  permission: AuthPermission
  fallbackRoute: string
}

const permissionsByRole: Record<UserRole, AuthPermission[]> = {
  [UserRole.SYSTEM_OWNER]: [
    AuthPermission.VIEW_APPLICATIONS,
    AuthPermission.MANAGE_APPLICATIONS,
    AuthPermission.VIEW_RESTAURANTS
  ],
  [UserRole.CLIENT]: [AuthPermission.VIEW_RESTAURANTS],
  [UserRole.STAFF]: [AuthPermission.VIEW_RESTAURANTS]
}

const routeAccessMap: Partial<Record<string, RouteAccess>> = {
  [ROUTES.APPLICATIONS]: {
    permission: AuthPermission.VIEW_APPLICATIONS,
    fallbackRoute: ROUTES.RESTAURANTS
  },
  [ROUTES.RESTAURANTS]: {
    permission: AuthPermission.VIEW_RESTAURANTS,
    fallbackRoute: ROUTES.AUTH
  }
}

export const hasPermission = (
  user: User | null,
  permission: AuthPermission
) => {
  if (!user) {
    return false
  }

  return permissionsByRole[user.role].includes(permission)
}

export const canAccessRoute = (user: User | null, route: string) => {
  const access = routeAccessMap[route]

  if (!access) {
    return true
  }

  return hasPermission(user, access.permission)
}

export const getRouteFallback = (route: string) => {
  return routeAccessMap[route]?.fallbackRoute ?? ROUTES.AUTH
}
