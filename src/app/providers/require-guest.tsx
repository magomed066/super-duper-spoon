import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { getDefaultRouteByRole, useAuthStore } from '@/entities/auth'

type RequireGuestProps = {
  children: ReactNode
}

export function RequireGuest({ children }: RequireGuestProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isHydrated = useAuthStore((state) => state.isHydrated)
  const user = useAuthStore((state) => state.user)

  if (!isHydrated) {
    return null
  }

  if (isAuthenticated) {
    return <Navigate to={getDefaultRouteByRole(user)} replace />
  }

  return <>{children}</>
}
