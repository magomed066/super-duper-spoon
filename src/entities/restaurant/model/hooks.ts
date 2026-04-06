import { notifications } from '@mantine/notifications'
import {
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query'
import type { ApiError } from '@/shared/api/errors'
import { RestaurantService } from '@/shared/api/services/restaurant'
import type { Restaurant } from '@/shared/api/services/restaurant/types'

export const useRestaurantsListQuery = (enabled = true) => {
  return useQuery<Restaurant[], ApiError>({
    queryKey: ['restaurants'],
    queryFn: () => RestaurantService.list(),
    enabled
  })
}

export const useRestaurantStatusMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<
    Restaurant,
    ApiError,
    { id: string; isActive: boolean }
  >({
    mutationFn: ({ id, isActive }) => RestaurantService.update(id, { isActive }),
    onSuccess: async (_, variables) => {
      notifications.show({
        color: 'green',
        title: variables.isActive ? 'Ресторан активирован' : 'Ресторан деактивирован',
        message: variables.isActive
          ? 'Статус ресторана обновлен'
          : 'Ресторан переведен в неактивный статус'
      })

      await queryClient.invalidateQueries({
        queryKey: ['restaurants']
      })
    },
    onError: (error) => {
      notifications.show({
        color: 'red',
        title: 'Ошибка обновления ресторана',
        message: error.message
      })
    }
  })
}
