import { AuthService } from '@/shared/api/services/auth'
import type { UserLogin, UserRegister } from '@/shared/api/services/auth/types'
import { useMutation } from '@tanstack/react-query'

type RequestError = {
  message: string
}

export const useLoginMutation = (
  onSuccess?: (data: any) => void,
  onError?: (err: string) => void
) => {
  return useMutation({
    mutationFn: async (data: UserLogin) => AuthService.login(data),
    onSuccess: (data) => {
      onSuccess?.(data)
    },
    onError: (err: RequestError) => {
      if (err?.message) {
        onError?.(err.message)
      }
    }
  })
}

export const useRegisterMutation = (
  onSuccess?: (data: any) => void,
  onError?: (err: string) => void
) => {
  return useMutation({
    mutationFn: async (data: UserRegister) => AuthService.register(data),
    onSuccess: (data) => {
      onSuccess?.(data)
    },
    onError: (err: RequestError) => {
      if (err?.message) {
        onError?.(err.message)
      }
    }
  })
}
