import { create } from 'zustand'
import type { User, UserLoginResponse } from '@/shared/api/services/auth/types'
import { ACCESS_TOKEN_STORAGE_KEY, AUTH_USER_STORAGE_KEY } from './storage'

type AuthState = {
  accessToken: string | null
  user: User | null
  isAuthenticated: boolean
  isHydrated: boolean
  setAuth: (payload: UserLoginResponse) => void
  clearAuth: () => void
  hydrateAuth: () => void
}

const readUserFromStorage = (): User | null => {
  const rawUser = localStorage.getItem(AUTH_USER_STORAGE_KEY)

  if (!rawUser) {
    return null
  }

  try {
    return JSON.parse(rawUser) as User
  } catch {
    localStorage.removeItem(AUTH_USER_STORAGE_KEY)
    return null
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isHydrated: false,
  setAuth: ({ accessToken, user }) => {
    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken)
    localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user))

    set({
      accessToken,
      user,
      isAuthenticated: true,
      isHydrated: true
    })
  },
  clearAuth: () => {
    localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY)
    localStorage.removeItem(AUTH_USER_STORAGE_KEY)

    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      isHydrated: true
    })
  },
  hydrateAuth: () => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)
    const user = readUserFromStorage()

    set({
      accessToken,
      user,
      isAuthenticated: Boolean(accessToken),
      isHydrated: true
    })
  }
}))
