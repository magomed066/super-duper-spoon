import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/entities/auth'
import { ROUTES } from '@/shared/config/routes'

type RequireGuestProps = {
  children: ReactNode
}

export function RequireGuest({ children }: RequireGuestProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isHydrated = useAuthStore((state) => state.isHydrated)

  if (!isHydrated) {
    return null
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.RESTAURANTS} replace />
  }

  return <>{children}</>
}
