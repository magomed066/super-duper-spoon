import { AuthInitializer } from '@/entities/auth'
import Routing from '@/pages/routing'
import { ErrorBoundary } from '@/shared/ui/error-boundary'

function App() {
  return (
    <ErrorBoundary>
      <AuthInitializer />
      <Routing />
    </ErrorBoundary>
  )
}

export default App
