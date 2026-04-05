import { notifications } from '@mantine/notifications'
import { useMutation } from '@tanstack/react-query'
import type { ApiError } from '@/shared/api/errors'
import { ApplocationService } from '@/shared/api/services/application'
import type {
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
