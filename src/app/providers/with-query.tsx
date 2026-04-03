import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode } from 'react'

const client = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 10
    }
  }
})

export const withReactQuery = (component: () => ReactNode) => () => {
  return (
    <QueryClientProvider client={client}>{component()}</QueryClientProvider>
  )
}
