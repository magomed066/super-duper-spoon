import AuthPage from '@/pages/auth'
import NotFoundPage from '@/pages/not-found'
import { ROUTES } from '@/shared/config/routes'

export const publicRoutes = [
  {
    Component: AuthPage,
    path: ROUTES.AUTH
  },
  {
    Component: NotFoundPage,
    path: ROUTES.NOT_FOUND
  }
]

export const privateRoutes = []
