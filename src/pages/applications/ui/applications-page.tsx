import { Divider, Stack, Text } from '@mantine/core'
import { Navigate } from 'react-router-dom'
import {
  AuthPermission,
  getRouteFallback,
  hasPermission,
  useAuthStore
} from '@/entities/auth'
import { ROUTES } from '@/shared/config/routes'
import { ErrorBoundary } from '@/shared/ui/error-boundary'
import ApplicationsListWidget from '@/widgets/applications-list'
import PageHeaderWidget from '@/widgets/page-header'

export function ApplicationsPage() {
  const user = useAuthStore((state) => state.user)
  const canViewApplications = hasPermission(
    user,
    AuthPermission.VIEW_APPLICATIONS
  )

  if (!canViewApplications) {
    return <Navigate to={getRouteFallback(ROUTES.APPLICATIONS)} replace />
  }

  return (
    <Stack pb={20}>
      <PageHeaderWidget title="Список заявок" />

      <Stack className="mt-3 px-5 flex flex-col gap">
        <Text maw={640} className="text-moss-700">
          Здесь отображаются все заявки на подключение ресторанов с текущими
          статусами и контактами заявителей.
        </Text>

        <Divider my={3} />

        <ErrorBoundary
          title="Не удалось отобразить список заявок"
          message="Во время отображения списка произошла ошибка. Попробуйте перезагрузить блок."
        >
          <ApplicationsListWidget />
        </ErrorBoundary>
      </Stack>
    </Stack>
  )
}
