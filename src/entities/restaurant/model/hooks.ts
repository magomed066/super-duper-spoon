import { notifications } from '@mantine/notifications'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ApiError } from '@/shared/api/errors'
import { RestaurantService } from '@/shared/api/services/restaurant'
import type {
  Restaurant,
  RestaurantsListParams,
  RestouranstsResponse
} from '@/shared/api/services/restaurant/types'
import { restauranstsQueryKeys } from './constants'

export const useRestaurantsListQuery = (
  enabled = true,
  params?: RestaurantsListParams
) => {
  return useQuery<RestouranstsResponse, ApiError>({
    queryKey: restauranstsQueryKeys.all(params),
    queryFn: () => RestaurantService.list(params),
    enabled
  })
}

export const useRestaurantStatusMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<Restaurant, ApiError, { id: string; isActive: boolean }>({
    mutationFn: ({ id, isActive }) =>
      RestaurantService.update(id, { isActive }),
    onSuccess: async (_, variables) => {
      notifications.show({
        color: 'green',
        title: variables.isActive
          ? 'Ресторан активирован'
          : 'Ресторан деактивирован',
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
