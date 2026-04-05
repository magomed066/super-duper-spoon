import AuthPage from '@/pages/auth'
import ApplicationsPage from '@/pages/applications'
import NotFoundPage from '@/pages/not-found'
import RestaurantPage from '@/pages/restaurants'
import RequestPage from '@/pages/request'
import { ROUTES } from '@/shared/config/routes'

export const publicRoutes = [
  {
    Component: AuthPage,
    path: ROUTES.AUTH
  },
  {
    Component: RequestPage,
    path: ROUTES.APPLICATION
  },
  {
    Component: RequestPage,
    path: ROUTES.REQUEST
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
