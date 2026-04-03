import { useEffect } from 'react'
import { useAuthStore } from './store'

export function AuthInitializer() {
  const hydrateAuth = useAuthStore((state) => state.hydrateAuth)

  useEffect(() => {
    hydrateAuth()
  }, [hydrateAuth])

  return null
}
