import { notifications } from '@mantine/notifications'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ApiError } from '@/shared/api/errors'
import { ApplocationService } from '@/shared/api/services/application'
import type {
  ApproveApplicationResult,
  RequestClient,
  RequestClientCreate
} from '@/shared/api/services/application/types'

export const useRequestClientMutation = (
  onSuccess?: (data: RequestClientCreate) => void,
  onError?: (error: ApiError) => void
) => {
  return useMutation<RequestClient, ApiError, RequestClientCreate>({
    mutationFn: (data) => ApplocationService.register(data),
    onSuccess: (data) => {
      onSuccess?.(data)
    },
    onError: (error) => {
      notifications.show({
        color: 'red',
        title: 'Ошибка',
        message: error.message
      })
      onError?.(error)
    }
  })
}

export const useApplicationsListQuery = (enabled = true) => {
  return useQuery<RequestClient[], ApiError>({
    queryKey: ['applications'],
    queryFn: () => ApplocationService.list(),
    enabled
  })
}

export const useApproveApplicationMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<ApproveApplicationResult, ApiError, string>({
    mutationFn: (id) => ApplocationService.approve(id),
    onSuccess: async ({ application, password }) => {
      notifications.show({
        color: 'green',
        title: 'Заявка подтверждена',
        message: `Для ${application.email} создан аккаунт. Временный пароль: ${password}`
      })

      await queryClient.invalidateQueries({
        queryKey: ['applications']
      })
    },
    onError: (error) => {
      notifications.show({
        color: 'red',
        title: 'Ошибка подтверждения',
        message: error.message
      })
    }
  })
}

export const useRejectApplicationMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<RequestClient, ApiError, string>({
    mutationFn: (id) => ApplocationService.reject(id),
    onSuccess: () => {
      notifications.show({
        color: 'green',
        title: 'Заявка отклонена',
        message: 'Статус заявки обновлен'
      })

      void queryClient.invalidateQueries({
        queryKey: ['applications']
      })
    },
    onError: (error) => {
      notifications.show({
        color: 'red',
        title: 'Ошибка отклонения',
        message: error.message
      })
    }
  })
}
