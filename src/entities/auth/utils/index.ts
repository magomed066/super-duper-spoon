import { AuthPermission, hasPermission } from '@/entities/auth/model/rbac'
import type { User } from '@/shared/api/services/auth/types'
import { ROUTES } from '@/shared/config/routes'

export const getDefaultRouteByRole = (user: User | null) => {
  if (hasPermission(user, AuthPermission.VIEW_APPLICATIONS)) {
    return ROUTES.APPLICATIONS
  }

  return ROUTES.RESTAURANTS
}
