import { useMutation } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import type { ApiError } from '@/shared/api/errors'
import { AuthService } from '@/shared/api/services/auth'
import type {
  AuthRegisterResponse,
  UserLogin,
  UserLoginResponse,
  UserRegister
} from '@/shared/api/services/auth/types'
import { useAuthStore } from './store'

export const useLoginMutation = (
  onSuccess?: (data: UserLoginResponse) => void,
  onError?: (error: ApiError) => void
) => {
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation<UserLoginResponse, ApiError, UserLogin>({
    mutationFn: (data) => AuthService.login(data),
    onSuccess: (data) => {
      setAuth(data)
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

export const useRegisterMutation = (
  onSuccess?: (data: AuthRegisterResponse) => void,
  onError?: (error: ApiError) => void
) => {
  return useMutation<AuthRegisterResponse, ApiError, UserRegister>({
    mutationFn: (data) => AuthService.register(data),
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
