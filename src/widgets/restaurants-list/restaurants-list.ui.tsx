import {
  RestaurantCard,
  RestaurantsEmptyPlaceholder,
  useRestaurantsListQuery
} from '@/entities/restaurant'
import { AuthPermission, hasPermission, useAuthStore } from '@/entities/auth'
import RestaurantActions from '@/features/restaurant/restaurant-actions'
import { getApiErrorMessage } from '@/shared/api/errors'
import { Alert, Loader, SimpleGrid, Stack } from '@mantine/core'
import { TbAlertCircle } from 'react-icons/tb'

export function RestaurantsListWidget() {
  const user = useAuthStore((state) => state.user)
  const canViewRestaurants = hasPermission(
    user,
    AuthPermission.VIEW_RESTAURANTS
  )

  const { data, error, isError, isLoading } =
    useRestaurantsListQuery(canViewRestaurants)

  if (isError) {
    return (
      <Alert
        color="coral"
        radius="md"
        title="Не удалось загрузить рестораны"
        icon={<TbAlertCircle size={18} />}
      >
        {getApiErrorMessage(error)}
      </Alert>
    )
  }

  if (isLoading) {
    return <Loader className="mx-auto" />
  }

  if (!data?.length) {
    return <RestaurantsEmptyPlaceholder />
  }

  return (
    <Stack className="w-full">
      <SimpleGrid cols={{ base: 1, sm: 2, xl: 3 }} spacing="lg">
        {data.map((item) => (
          <RestaurantCard
            key={item.id}
            data={item}
            renderActions={(item) => <RestaurantActions data={item} />}
          />
        ))}
      </SimpleGrid>
    </Stack>
  )
}
