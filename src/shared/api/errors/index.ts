import axios from 'axios'

type ApiErrorResponse = {
  message?: string
  error?: string
  errors?: Record<string, string | string[]>
}

export type ApiError = {
  message: string
  status?: number
  code?: string
  statusCode?: string
  details?: ApiErrorResponse | string | null
}

const DEFAULT_ERROR_MESSAGE = 'Что-то пошло не так. Попробуйте еще раз.'

const getValidationMessage = (errors?: Record<string, string | string[]>) => {
  if (!errors) {
    return null
  }

  const messages = Object.values(errors).flatMap((value) =>
    Array.isArray(value) ? value : [value]
  )

  return messages.find(Boolean) ?? null
}

export const normalizeApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const status = error.response?.status
    const responseData = error.response?.data
    const message =
      responseData?.message ??
      responseData?.error ??
      getValidationMessage(responseData?.errors) ??
      error.message ??
      DEFAULT_ERROR_MESSAGE

    return {
      message,
      status,
      code: error.code,
      details: responseData ?? null
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message || DEFAULT_ERROR_MESSAGE
    }
  }

  if (typeof error === 'string' && error.trim().length > 0) {
    return {
      message: error
    }
  }

  return {
    message: DEFAULT_ERROR_MESSAGE
  }
}

export const getApiErrorMessage = (error: unknown) =>
  normalizeApiError(error).message
