import { useMutation } from '@tanstack/react-query'

type LoginUser = {
  email: string
  password: string
}

type RequestError = {
  message: string
}

export const useRegisterMutation = (
  onSuccess?: (data: any) => void,
  onError?: (err: string) => void
) => {
  return useMutation({
    mutationFn: async (data: LoginUser) => {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (!response.ok) {
        // пробрасываем ошибку в onError
        throw result as RequestError
      }

      return result
    },

    onSuccess: (data) => {
      onSuccess?.(data)
    },

    onError: (err: RequestError) => {
      console.error(err)

      if (err?.message) {
        onError?.(err.message)
      }
    }
  })
}
