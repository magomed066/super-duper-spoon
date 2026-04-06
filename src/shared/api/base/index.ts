import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig
} from 'axios'
import { normalizeApiError } from '@/shared/api/errors'
import { useAuthStore } from '@/entities/auth/model/store'
import {
  ACCESS_TOKEN_STORAGE_KEY,
  REFRESH_TOKEN_STORAGE_KEY
} from '@/entities/auth/model/storage'
import { ROUTES } from '@/shared/config/routes'

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
}

export class ApiBase {
  private client: AxiosInstance
  private refreshRequest: Promise<string> | null = null

  constructor() {
    this.client = axios.create({
      baseURL: `${import.meta.env.VITE_PUBLIC_API_BASE_URL}/api`,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })

    // Adding token to each request
    this.client.interceptors.request.use((req) => {
      const isAuthRequest =
        req.url?.includes('/auth/login') || req.url?.includes('/auth/refresh')

      if (isAuthRequest) {
        return req
      }

      const token = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)

      if (token) {
        req.headers.authorization = `Bearer ${token}`
      }

      return req
    })

    this.client.interceptors.response.use(
      // Here we can update token using response. Need to validate with backend
      (response) => {
        return response
      },
      async (error) => {
        const originalRequest = error.config as RetryableRequestConfig | undefined
        const isUnauthorized =
          error instanceof AxiosError && error.response?.status === 401
        const isRefreshRequest = originalRequest?.url?.includes('/auth/refresh')

        if (isUnauthorized && originalRequest && !originalRequest._retry && !isRefreshRequest) {
          originalRequest._retry = true

          try {
            const accessToken = await this.refreshAccessToken()

            originalRequest.headers.authorization = `Bearer ${accessToken}`

            return this.client(originalRequest)
          } catch (refreshError) {
            this.handleUnauthorized()
            return Promise.reject(normalizeApiError(refreshError))
          }
        }

        if (isUnauthorized) {
          this.handleUnauthorized()
        }

        return Promise.reject(normalizeApiError(error))
      }
    )
  }

  private async refreshAccessToken(): Promise<string> {
    if (!this.refreshRequest) {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY)

      if (!refreshToken) {
        throw new Error('Refresh token is missing')
      }

      this.refreshRequest = this.client
        .post<{ accessToken: string }>('/auth/refresh', { refreshToken })
        .then((response) => {
          const accessToken = response.data.accessToken

          useAuthStore.getState().setAccessToken(accessToken)

          return accessToken
        })
        .finally(() => {
          this.refreshRequest = null
        })
    }

    return this.refreshRequest
  }

  private handleUnauthorized() {
    useAuthStore.getState().clearAuth()

    if (window.location.pathname !== ROUTES.AUTH) {
      window.location.replace(ROUTES.AUTH)
    }
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config)
    return response?.data
  }

  public async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.post<T>(url, data, config)
    return response.data
  }

  public async put<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.put<T>(url, data)
    return response.data
  }

  public async delete<T>(url: string, data?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, data)
    return response.data
  }
}

export const apiService = new ApiBase()
