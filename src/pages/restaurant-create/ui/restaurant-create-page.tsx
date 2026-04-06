import {
  AuthPermission,
  getDefaultRouteByRole,
  getRouteFallback,
  hasPermission,
  useAuthStore
} from '@/entities/auth'
import { CreateRestaurantForm } from '@/features/restaurant/create-restaurant-form'
import { ROUTES } from '@/shared/config/routes'
import PageHeaderWidget from '@/widgets/page-header'
import { Button, Stack, Text, Title } from '@mantine/core'
import { FiArrowLeft } from 'react-icons/fi'
import { Link, Navigate } from 'react-router'

export function RestaurantCreatePage() {
  const user = useAuthStore((state) => state.user)
  const canCreateRestaurant = hasPermission(
    user,
    AuthPermission.CREATE_RESTAURANT
  )

  if (!canCreateRestaurant) {
    return (
      <Navigate
        to={
          user
            ? getDefaultRouteByRole(user)
            : getRouteFallback(ROUTES.RESTAURANTS_CREATE)
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
          { label: 'Создание ресторана' }
        ]}
      />

      <Stack className="mt-3 px-5 flex flex-col gap">
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

        <div className="border-b border-black/8 pb-5">
          <Title
            order={3}
            className="text-[28px] tracking-[-0.03em] text-moss-900"
          >
            Регистрация ресторана
          </Title>
          <Text size="sm" className="mt-2 leading-6 text-moss-700">
            Заполните карточку по шагам: сначала контакты, затем доставку и
            расписание, после этого добавьте изображения.
          </Text>
        </div>
      </Stack>

      <section className="px-5 py-4">
        <div className="max-w-250">
          <CreateRestaurantForm />
        </div>
      </section>
    </Stack>
  )
}
