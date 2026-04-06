import { notifications } from '@mantine/notifications'
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query'
import type { ApiError } from '@/shared/api/errors'
import { RestaurantService } from '@/shared/api/services/restaurant'
import type {
  CreateRestaurantPayload,
  CreateRestaurantResponse,
  Restaurant,
  RestaurantsListParams,
  RestouranstsResponse
} from '@/shared/api/services/restaurant/types'
import { restauranstsQueryKeys } from './constants'
import { useNavigate } from 'react-router'
import { ROUTES } from '@/shared/config/routes'

export const useRestaurantsListQuery = (
  enabled = true,
  params?: RestaurantsListParams
) => {
  return useInfiniteQuery<RestouranstsResponse, ApiError>({
    queryKey: restauranstsQueryKeys.all(params),
    queryFn: ({ pageParam }) =>
      RestaurantService.list({
        ...params,
        page: Number(pageParam)
      }),
    enabled,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage
        ? lastPage.pagination.page + 1
        : undefined
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

export const useDeleteRestaurantMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<{ message?: string }, ApiError, string>({
    mutationFn: (id) => RestaurantService.delete(id),
    onSuccess: async () => {
      notifications.show({
        color: 'green',
        title: 'Ресторан удален',
        message: 'Ресторан был успешно удален'
      })

      await queryClient.invalidateQueries({
        queryKey: ['restaurants']
      })
    },
    onError: (error) => {
      notifications.show({
        color: 'red',
        title: 'Ошибка удаления ресторана',
        message: error.message
      })
    }
  })
}

export const useCreateRestaurantMutation = (onSuccess?: () => void) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation<
    CreateRestaurantResponse,
    ApiError,
    CreateRestaurantPayload
  >({
    mutationFn: (payload) => RestaurantService.create(payload),
    onSuccess: async ({ restaurant }) => {
      notifications.show({
        color: 'green',
        title: 'Ресторан создан',
        message: `${restaurant.name} добавлен в систему`
      })

      await queryClient.invalidateQueries({
        queryKey: ['restaurants']
      })

      onSuccess?.()
      navigate(ROUTES.RESTAURANTS)
    },
    onError: (error) => {
      notifications.show({
        color: 'red',
        title: 'Ошибка создания ресторана',
        message: error.message
      })
    }
  })
}
