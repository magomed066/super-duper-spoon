import { notifications } from '@mantine/notifications'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ApiError } from '@/shared/api/errors'
import { MenuItemService } from '@/shared/api/services/menu-item'
import type {
  CreateMenuItemPayload,
  MenuItem,
  UpdateMenuItemPayload
} from '@/shared/api/services/menu-item/types'
import { menuItemsQueryKeys } from './constants'

const invalidateMenuItemQueries = async (
  queryClient: ReturnType<typeof useQueryClient>,
  restaurantId: string
) => {
  await queryClient.invalidateQueries({
    queryKey: menuItemsQueryKeys.all(restaurantId)
  })
}

export const useMenuItemsQuery = (restaurantId?: string, enabled = true) => {
  return useQuery<MenuItem[], ApiError>({
    queryKey: menuItemsQueryKeys.all(restaurantId),
    queryFn: () => MenuItemService.listByRestaurant(restaurantId ?? ''),
    enabled: enabled && Boolean(restaurantId)
  })
}

export const useCreateMenuItemMutation = (
  restaurantId: string,
  onSuccess?: () => void
) => {
  const queryClient = useQueryClient()

  return useMutation<MenuItem, ApiError, CreateMenuItemPayload>({
    mutationFn: (payload) => MenuItemService.create(restaurantId, payload),
    onSuccess: async (item) => {
      notifications.show({
        color: 'green',
        title: 'Блюдо создано',
        message: `${item.name} добавлено в меню`
      })

      await invalidateMenuItemQueries(queryClient, restaurantId)
      onSuccess?.()
    },
    onError: (error) => {
      notifications.show({
        color: 'red',
        title: 'Ошибка создания блюда',
        message: error.message
      })
    }
  })
}

export const useUpdateMenuItemMutation = (
  restaurantId: string,
  onSuccess?: () => void
) => {
  const queryClient = useQueryClient()

  return useMutation<
    MenuItem,
    ApiError,
    { itemId: string; payload: UpdateMenuItemPayload }
  >({
    mutationFn: ({ itemId, payload }) =>
      MenuItemService.update(restaurantId, itemId, payload),
    onSuccess: async (item) => {
      await invalidateMenuItemQueries(queryClient, restaurantId)
      onSuccess?.()

      notifications.show({
        color: 'green',
        title: 'Блюдо обновлено',
        message: `${item.name} успешно сохранено`
      })
    },
    onError: (error) => {
      notifications.show({
        color: 'red',
        title: 'Ошибка обновления блюда',
        message: error.message
      })
    }
  })
}

export const useDeleteMenuItemMutation = (
  restaurantId: string,
  onSuccess?: () => void
) => {
  const queryClient = useQueryClient()

  return useMutation<void, ApiError, string>({
    mutationFn: (itemId) => MenuItemService.delete(restaurantId, itemId),
    onSuccess: async () => {
      await invalidateMenuItemQueries(queryClient, restaurantId)
      onSuccess?.()

      notifications.show({
        color: 'green',
        title: 'Блюдо удалено',
        message: 'Позиция была успешно удалена'
      })
    },
    onError: (error) => {
      notifications.show({
        color: 'red',
        title: 'Ошибка удаления блюда',
        message: error.message
      })
    }
  })
}
