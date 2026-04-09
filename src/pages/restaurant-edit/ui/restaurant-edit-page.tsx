import {
  AuthPermission,
  getDefaultRouteByRole,
  getRouteFallback,
  hasPermission,
  useAuthStore
} from '@/entities/auth'
import { useRestaurantQuery } from '@/entities/restaurant'
import { EditRestaurantForm } from '@/features/restaurant/edit-restaurant-form'
import { getApiErrorMessage } from '@/shared/api/errors'
import { ROUTES } from '@/shared/config/routes'
import PageHeaderWidget from '@/widgets/page-header'
import {
  Alert,
  Button,
  Loader,
  Stack,
  Text,
  Title
} from '@mantine/core'
import { FiArrowLeft } from 'react-icons/fi'
import { TbAlertCircle } from 'react-icons/tb'
import { Link, Navigate, useParams } from 'react-router'

export function RestaurantEditPage() {
  const user = useAuthStore((state) => state.user)
  const { id = '' } = useParams()
  const canEditRestaurant = hasPermission(
    user,
    AuthPermission.EDIT_RESTAURANT
  )
  const { data, error, isError, isLoading } = useRestaurantQuery(
    id,
    canEditRestaurant
  )

  if (!canEditRestaurant) {
    return (
      <Navigate
        to={
          user
            ? getDefaultRouteByRole(user)
            : getRouteFallback(ROUTES.RESTAURANTS_EDIT)
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
          { label: data?.name ?? 'Редактирование ресторана' }
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
            Редактирование ресторана
          </Title>
          <Text size="sm" className="mt-2 leading-6 text-moss-700">
            Обновите данные ресторана по шагам и сохраните изменения после
            проверки полей.
          </Text>
        </div>
      </Stack>

      <section className="px-5 py-4">
        <div className="max-w-250">
          {isLoading ? <Loader className="mx-auto" /> : null}

          {isError ? (
            <Alert
              color="coral"
              radius="md"
              title="Не удалось загрузить ресторан"
              icon={<TbAlertCircle size={18} />}
            >
              {getApiErrorMessage(error)}
            </Alert>
          ) : null}

          {data ? <EditRestaurantForm restaurant={data} /> : null}
        </div>
      </section>
    </Stack>
  )
}
