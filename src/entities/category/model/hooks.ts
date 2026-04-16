import { notifications } from '@mantine/notifications'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ApiError } from '@/shared/api/errors'
import { CategoryService } from '@/shared/api/services/category'
import type {
  Category,
  CreateCategoryPayload,
  ReorderCategoriesPayload,
  UpdateCategoryPayload
} from '@/shared/api/services/category/types'
import { categoriesQueryKeys } from './constants'

const invalidateCategoryQueries = async (
  queryClient: ReturnType<typeof useQueryClient>,
  restaurantId: string
) => {
  await queryClient.invalidateQueries({
    queryKey: categoriesQueryKeys.all(restaurantId)
  })
}

export const useCategoriesQuery = (restaurantId?: string, enabled = true) => {
  return useQuery<Category[], ApiError>({
    queryKey: categoriesQueryKeys.all(restaurantId),
    queryFn: () => CategoryService.listByRestaurant(restaurantId ?? ''),
    enabled: enabled && Boolean(restaurantId)
  })
}

export const useCreateCategoryMutation = (
  restaurantId: string,
  onSuccess?: () => void
) => {
  const queryClient = useQueryClient()

  return useMutation<Category, ApiError, CreateCategoryPayload>({
    mutationFn: (payload) => CategoryService.create(restaurantId, payload),
    onSuccess: async (category) => {
      notifications.show({
        color: 'green',
        title: 'Категория создана',
        message: `${category.name} добавлена в меню`
      })

      await invalidateCategoryQueries(queryClient, restaurantId)
      onSuccess?.()
    },
    onError: (error) => {
      notifications.show({
        color: 'red',
        title: 'Ошибка создания категории',
        message: error.message
      })
    }
  })
}

export const useUpdateCategoryMutation = (
  restaurantId: string,
  categoryId: string,
  onSuccess?: () => void
) => {
  const queryClient = useQueryClient()

  return useMutation<Category, ApiError, UpdateCategoryPayload>({
    mutationFn: (payload) =>
      CategoryService.update(restaurantId, categoryId, payload),
    onSuccess: async (category) => {
      notifications.show({
        color: 'green',
        title: 'Категория обновлена',
        message: `${category.name} успешно сохранена`
      })

      await Promise.all([
        invalidateCategoryQueries(queryClient, restaurantId),
        queryClient.invalidateQueries({
          queryKey: categoriesQueryKeys.detail(restaurantId, categoryId)
        })
      ])

      onSuccess?.()
    },
    onError: (error) => {
      notifications.show({
        color: 'red',
        title: 'Ошибка обновления категории',
        message: error.message
      })
    }
  })
}

export const useDeleteCategoryMutation = (
  restaurantId: string,
  onSuccess?: () => void
) => {
  const queryClient = useQueryClient()

  return useMutation<void, ApiError, string>({
    mutationFn: (categoryId) => CategoryService.delete(restaurantId, categoryId),
    onSuccess: async () => {
      notifications.show({
        color: 'green',
        title: 'Категория удалена',
        message: 'Категория была успешно удалена'
      })

      await invalidateCategoryQueries(queryClient, restaurantId)
      onSuccess?.()
    },
    onError: (error) => {
      notifications.show({
        color: 'red',
        title: 'Ошибка удаления категории',
        message: error.message
      })
    }
  })
}

export const useReorderCategoriesMutation = (restaurantId: string) => {
  const queryClient = useQueryClient()

  return useMutation<
    Category[],
    ApiError,
    ReorderCategoriesPayload,
    { previousCategories?: Category[] }
  >({
    mutationFn: (payload) => CategoryService.reorder(restaurantId, payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({
        queryKey: categoriesQueryKeys.all(restaurantId)
      })

      const previousCategories = queryClient.getQueryData<Category[]>(
        categoriesQueryKeys.all(restaurantId)
      )

      if (previousCategories?.length) {
        const nextSortOrder = new Map(
          payload.categoryIds.map((categoryId, index) => [categoryId, index])
        )

        const reorderedCategories = [...previousCategories]
          .sort((left, right) => {
            return (
              (nextSortOrder.get(left.id) ?? left.sortOrder) -
              (nextSortOrder.get(right.id) ?? right.sortOrder)
            )
          })
          .map((category, index) => ({
            ...category,
            sortOrder: index
          }))

        queryClient.setQueryData(
          categoriesQueryKeys.all(restaurantId),
          reorderedCategories
        )
      }

      return { previousCategories }
    },
    onError: (error, _payload, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData(
          categoriesQueryKeys.all(restaurantId),
          context.previousCategories
        )
      }

      notifications.show({
        color: 'red',
        title: 'Ошибка сортировки категорий',
        message: error.message
      })
    },
    onSuccess: (categories) => {
      queryClient.setQueryData(categoriesQueryKeys.all(restaurantId), categories)
    },
    onSettled: async () => {
      await invalidateCategoryQueries(queryClient, restaurantId)
    }
  })
}
