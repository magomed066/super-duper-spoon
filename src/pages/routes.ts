import AuthPage from '@/pages/auth'
import ApplicationsPage from '@/pages/applications'
import NotFoundPage from '@/pages/not-found'
import RestaurantPage from '@/pages/restaurants'
import RequestPage from '@/pages/request'
import RequestSuccessPage from '@/pages/request-success'
import UnauthorizedPage from '@/pages/unauthorized'
import { ROUTES } from '@/shared/config/routes'

export const publicRoutes = [
  {
    Component: AuthPage,
    path: ROUTES.AUTH
  },
  {
    Component: UnauthorizedPage,
    path: ROUTES.UNAUTHORIZED
  },
  {
    Component: RequestPage,
    path: ROUTES.REQUEST
  },
  {
    Component: RequestSuccessPage,
    path: ROUTES.REQUEST_SUCCESS
  },
  {
    Component: NotFoundPage,
    path: ROUTES.NOT_FOUND
  }
]

export const privateRoutes = [
  {
    Component: ApplicationsPage,
    path: ROUTES.APPLICATIONS
  },
  {
    Component: RestaurantPage,
    path: ROUTES.RESTAURANTS
  }
]
