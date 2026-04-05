import { UserRole, type User } from '@/shared/api/services/auth/types'
import { ROUTES } from '@/shared/config/routes'

export const getDefaultRouteByRole = (user: User | null) => {
  if (user?.role === UserRole.OWNER) {
    return ROUTES.APPLICATIONS
  }

  return ROUTES.RESTAURANTS
}
