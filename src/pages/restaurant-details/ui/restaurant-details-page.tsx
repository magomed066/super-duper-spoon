import {
  AuthPermission,
  getDefaultRouteByRole,
  getRouteFallback,
  hasPermission,
  useAuthStore
} from '@/entities/auth'
import { ROUTES } from '@/shared/config/routes'
import PageHeaderWidget from '@/widgets/page-header'
import RestaurantDetailsWidget from '@/widgets/restaurant-details'
import { Button, Stack } from '@mantine/core'
import { Link, Navigate, useParams } from 'react-router'
import { FiArrowLeft } from 'react-icons/fi'
import { ErrorBoundary } from '@/shared/ui/error-boundary'

export function RestaurantDetailsPage() {
  const user = useAuthStore((state) => state.user)
  const { id = '' } = useParams()
  const canViewRestaurants = hasPermission(
    user,
    AuthPermission.VIEW_RESTAURANTS
  )
  const canViewMenu = hasPermission(user, AuthPermission.VIEW_MENU)

  if (!canViewRestaurants) {
    return (
      <Navigate
        to={
          user
            ? getDefaultRouteByRole(user)
            : getRouteFallback(ROUTES.RESTAURANTS_DETAILS)
        }
        replace
      />
    )
  }

  return (
    <Stack pb={20}>
      <PageHeaderWidget
        items={[
          { label: 'Список ресторанов', href: ROUTES.RESTAURANTS },
          { label: 'Карточка ресторана' }
        ]}
      />

      <Stack className="mt-3 px-5">
        <Stack
          gap="sm"
          className="w-full"
        >
          <Button
            component={Link}
            to={ROUTES.RESTAURANTS}
            variant="transparent"
            color="dark"
            leftSection={<FiArrowLeft size={16} />}
            p={0}
            className="self-start px-0 text-moss-900"
          >
            К списку ресторанов
          </Button>

          {canViewMenu ? (
            <Button
              component={Link}
              to={`${ROUTES.MENU}?restaurantId=${encodeURIComponent(id)}`}
              variant="light"
              color="aurora"
              className="self-start"
            >
              Перейти в меню ресторана
            </Button>
          ) : null}
        </Stack>

        <ErrorBoundary
          title="Не удалось отобразить информацию о ресторане"
          message="Во время отображения ресторана произошла ошибка. Попробуйте перезагрузить блок."
        >
          <RestaurantDetailsWidget id={id} />
        </ErrorBoundary>
      </Stack>
    </Stack>
  )
}
