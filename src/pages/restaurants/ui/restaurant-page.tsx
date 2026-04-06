import { AuthPermission, hasPermission, useAuthStore } from '@/entities/auth'
import { ErrorBoundary } from '@/shared/ui/error-boundary'
import { ROUTES } from '@/shared/config/routes'
import PageHeaderWidget from '@/widgets/page-header'
import RestaurantsListWidget from '@/widgets/restaurants-list'
import { Button, Divider, Group, Stack, Text } from '@mantine/core'
import { Link } from 'react-router'

export function RestaurantPage() {
  const user = useAuthStore((state) => state.user)
  const canCreateRestaurant = hasPermission(
    user,
    AuthPermission.CREATE_RESTAURANT
  )

  return (
    <Stack pb={20}>
      <PageHeaderWidget title="Список ресторанов" />

      <Stack className="mt-3 px-5 flex flex-col gap">
        <Group justify="space-between" align="end" gap="md">
          <Text maw={640} className="text-moss-700">
            Здесь отображается список всех ваших ресторанов.
          </Text>

          {canCreateRestaurant ? (
            <Button component={Link} to={ROUTES.RESTAURANTS_CREATE}>
              Создать ресторан
            </Button>
          ) : null}
        </Group>

        <Divider my={3} />

        <ErrorBoundary
          title="Не удалось отобразить список ресторанов"
          message="Во время отображения списка произошла ошибка. Попробуйте перезагрузить блок."
        >
          <RestaurantsListWidget />
        </ErrorBoundary>
      </Stack>
    </Stack>
  )
}
