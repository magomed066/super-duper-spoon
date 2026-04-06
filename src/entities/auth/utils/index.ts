import { PlatformPermission, hasPlatformPermission } from '@/entities/auth/model/rbac'
import type { User } from '@/shared/api/services/auth/types'
import { ROUTES } from '@/shared/config/routes'

export const getDefaultRouteByRole = (user: User | null) => {
  if (hasPlatformPermission(user, PlatformPermission.VIEW_APPLICATIONS)) {
    return ROUTES.APPLICATIONS
  }

  return ROUTES.RESTAURANTS
}
