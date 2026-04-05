import { useNavigate } from 'react-router-dom'
import { RequestCard } from '@/features/application/request-card'
import { ROUTES } from '@/shared/config/routes'

export function RequestPage() {
  const navigate = useNavigate()

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate(ROUTES.AUTH)
  }

  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <RequestCard onBack={handleBack} />
    </main>
  )
}
