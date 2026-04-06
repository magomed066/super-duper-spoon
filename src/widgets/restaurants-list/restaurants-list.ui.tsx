import {
  RestaurantCard,
  RestaurantsEmptyPlaceholder,
  useRestaurantsListQuery
} from '@/entities/restaurant'
import { AuthPermission, hasPermission, useAuthStore } from '@/entities/auth'
import FiltersRestaurants from '@/features/restaurant/filters'
import { useRestaurantFilters } from '@/features/restaurant/filters/hooks/use-restaurant-filters'
import RestaurantActions from '@/features/restaurant/restaurant-actions'
import { getApiErrorMessage } from '@/shared/api/errors'
import { Alert, Loader, SimpleGrid, Stack, Text } from '@mantine/core'
import { TbAlertCircle } from 'react-icons/tb'

export function RestaurantsListWidget() {
  const user = useAuthStore((state) => state.user)
  const { search, status, hasActiveFilters } = useRestaurantFilters()
  const restaurantListParams = {
    search: search || undefined,
    isActive: status === 'all' ? undefined : status === 'active'
  }

  const canViewRestaurants = hasPermission(
    user,
    AuthPermission.VIEW_RESTAURANTS
  )

  const { data, error, isError, isLoading } = useRestaurantsListQuery(
    canViewRestaurants,
    restaurantListParams
  )

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

  return (
    <Stack className="w-full">
      <FiltersRestaurants />

      {!data?.items?.length ? (
        hasActiveFilters ? (
          <Stack
            align="center"
            justify="center"
            className="min-h-48 rounded-md bg-white p-xl text-center"
          >
            <Text fw={600}>Рестораны не найдены</Text>
            <Text c="dimmed">
              Измените параметры поиска или фильтр по статусу.
            </Text>
          </Stack>
        ) : (
          <RestaurantsEmptyPlaceholder />
        )
      ) : (
        <Stack className="w-full">
          <SimpleGrid cols={{ base: 1, sm: 2, xl: 4 }} spacing="lg">
            {data.items.map((item) => (
              <RestaurantCard
                key={item.id}
                data={item}
                renderActions={(item) => <RestaurantActions data={item} />}
              />
            ))}
          </SimpleGrid>
        </Stack>
      )}
    </Stack>
  )
}
