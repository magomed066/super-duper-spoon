import { notifications } from '@mantine/notifications'
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query'
import type { ApiError } from '@/shared/api/errors'
import { RestaurantService } from '@/shared/api/services/restaurant'
import type {
  AssignRestaurantManagerPayload,
  CreateRestaurantPayload,
  CreateRestaurantResponse,
  Restaurant,
  RestaurantMembership,
  UpdateRestaurantPayload,
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

export const useRestaurantQuery = (id?: string, enabled = true) => {
  return useQuery<Restaurant, ApiError>({
    queryKey: ['restaurants', id],
    queryFn: () => RestaurantService.getById(id ?? ''),
    enabled: enabled && Boolean(id)
  })
}

export const usePublicRestaurantsListQuery = (
  enabled = true,
  params?: RestaurantsListParams
) => {
  return useInfiniteQuery<RestouranstsResponse, ApiError>({
    queryKey: ['public-restaurants', params],
    queryFn: ({ pageParam }) =>
      RestaurantService.listPublic({
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

export const usePublicRestaurantQuery = (id?: string, enabled = true) => {
  return useQuery<Restaurant, ApiError>({
    queryKey: ['public-restaurants', id],
    queryFn: () => RestaurantService.getPublicById(id ?? ''),
    enabled: enabled && Boolean(id)
  })
}

const invalidateRestaurantQueries = async (
  queryClient: ReturnType<typeof useQueryClient>,
  restaurantId?: string
) => {
  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: ['restaurants']
    }),
    queryClient.invalidateQueries({
      queryKey: ['public-restaurants']
    }),
    restaurantId
      ? queryClient.invalidateQueries({
          queryKey: ['restaurants', restaurantId]
        })
      : Promise.resolve(),
    restaurantId
      ? queryClient.invalidateQueries({
          queryKey: ['restaurant-users', restaurantId]
        })
      : Promise.resolve()
  ])
}

type RestaurantActionMutationOptions = {
  successTitle: string
  successMessage: (restaurant: Restaurant) => string
  errorTitle: string
}

const useRestaurantActionMutation = (
  mutationFn: (id: string) => Promise<Restaurant>,
  options: RestaurantActionMutationOptions
) => {
  const queryClient = useQueryClient()

  return useMutation<Restaurant, ApiError, string>({
    mutationFn,
    onSuccess: async (restaurant, id) => {
      notifications.show({
        color: 'green',
        title: options.successTitle,
        message: options.successMessage(restaurant)
      })

      await invalidateRestaurantQueries(queryClient, id)
    },
    onError: (error) => {
      notifications.show({
        color: 'red',
        title: options.errorTitle,
        message: error.message
      })
    }
  })
}

export const useSubmitRestaurantForApprovalMutation = () =>
  useRestaurantActionMutation(RestaurantService.submitForApproval, {
    successTitle: 'Ресторан отправлен на модерацию',
    successMessage: (restaurant) =>
      `${restaurant.name} теперь ожидает проверки`,
    errorTitle: 'Ошибка отправки на модерацию'
  })

export const useApproveRestaurantMutation = () =>
  useRestaurantActionMutation(RestaurantService.approve, {
    successTitle: 'Ресторан одобрен',
    successMessage: (restaurant) => `${restaurant.name} опубликован`,
    errorTitle: 'Ошибка подтверждения ресторана'
  })

export const useRequestRestaurantChangesMutation = () =>
  useRestaurantActionMutation(RestaurantService.requestChanges, {
    successTitle: 'Изменения запрошены',
    successMessage: (restaurant) =>
      `Для ${restaurant.name} требуется обновить данные`,
    errorTitle: 'Ошибка запроса правок'
  })

export const useRejectRestaurantMutation = () =>
  useRestaurantActionMutation(RestaurantService.reject, {
    successTitle: 'Ресторан отклонен',
    successMessage: (restaurant) =>
      `${restaurant.name} переведен в статус отклоненного`,
    errorTitle: 'Ошибка отклонения ресторана'
  })

export const useBlockRestaurantMutation = () =>
  useRestaurantActionMutation(RestaurantService.block, {
    successTitle: 'Ресторан заблокирован',
    successMessage: (restaurant) => `${restaurant.name} скрыт из публикации`,
    errorTitle: 'Ошибка блокировки ресторана'
  })

export const useArchiveRestaurantMutation = () =>
  useRestaurantActionMutation(RestaurantService.archive, {
    successTitle: 'Ресторан архивирован',
    successMessage: (restaurant) => `${restaurant.name} перемещен в архив`,
    errorTitle: 'Ошибка архивации ресторана'
  })

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

      await invalidateRestaurantQueries(queryClient)
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

      await invalidateRestaurantQueries(queryClient, restaurant.id)

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

export const useUpdateRestaurantMutation = (
  restaurantId: string,
  onSuccess?: () => void
) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation<Restaurant, ApiError, UpdateRestaurantPayload>({
    mutationFn: (payload) => RestaurantService.update(restaurantId, payload),
    onSuccess: async (restaurant) => {
      notifications.show({
        color: 'green',
        title: 'Ресторан обновлен',
        message: `${restaurant.name} успешно сохранен`
      })

      await invalidateRestaurantQueries(queryClient, restaurantId)

      onSuccess?.()
      navigate(ROUTES.RESTAURANTS)
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

export const useRestaurantUsersQuery = (restaurantId?: string, enabled = true) => {
  return useQuery<RestaurantMembership[], ApiError>({
    queryKey: ['restaurant-users', restaurantId],
    queryFn: () => RestaurantService.getUsers(restaurantId ?? ''),
    enabled: enabled && Boolean(restaurantId)
  })
}

export const useAssignRestaurantManagerMutation = (restaurantId: string) => {
  const queryClient = useQueryClient()

  return useMutation<
    RestaurantMembership,
    ApiError,
    AssignRestaurantManagerPayload
  >({
    mutationFn: (payload) => RestaurantService.assignManager(restaurantId, payload),
    onSuccess: async () => {
      notifications.show({
        color: 'green',
        title: 'Менеджер назначен',
        message: 'Состав команды ресторана обновлен'
      })

      await queryClient.invalidateQueries({
        queryKey: ['restaurant-users', restaurantId]
      })
    },
    onError: (error) => {
      notifications.show({
        color: 'red',
        title: 'Ошибка назначения менеджера',
        message: error.message
      })
    }
  })
}

export const useRemoveRestaurantManagerMutation = (restaurantId: string) => {
  const queryClient = useQueryClient()

  return useMutation<void, ApiError, string>({
    mutationFn: (userId) => RestaurantService.removeManager(restaurantId, userId),
    onSuccess: async () => {
      notifications.show({
        color: 'green',
        title: 'Менеджер удален',
        message: 'Пользователь больше не привязан к ресторану как менеджер'
      })

      await queryClient.invalidateQueries({
        queryKey: ['restaurant-users', restaurantId]
      })
    },
    onError: (error) => {
      notifications.show({
        color: 'red',
        title: 'Ошибка удаления менеджера',
        message: error.message
      })
    }
  })
}
