import {
  Alert,
  Badge,
  Button,
  Card,
  Group,
  Loader,
  Stack,
  Text,
  Title
} from '@mantine/core'
import { Navigate, useNavigate } from 'react-router-dom'
import { IoAlertCircle } from 'react-icons/io5'
import {
  applicationStatus,
  useApplicationsListQuery
} from '@/entities/application'
import { useAuthStore } from '@/entities/auth'
import { useLogoutMutation } from '@/entities/auth/model/hooks'
import { getApiErrorMessage } from '@/shared/api/errors'
import { type RequestClient } from '@/shared/api/services/application/types'
import { UserRole } from '@/shared/api/services/auth/types'
import { ROUTES } from '@/shared/config/routes'

const formatDate = (value?: string) => {
  if (!value) {
    return 'Дата не указана'
  }

  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value))
}

const ApplicationCard = ({ application }: { application: RequestClient }) => {
  const status = applicationStatus[application.status]

  return (
    <Card
      radius="xl"
      padding="xl"
      shadow="sm"
      className="border border-white/70 bg-white/90"
    >
      <Stack gap="lg">
        <Group justify="space-between" align="flex-start" gap="md">
          <div className="min-w-0">
            <Text fw={700} size="lg" className="truncate">
              {application.restaurantName}
            </Text>
            <Text c="dimmed" size="sm">
              {application.name}
            </Text>
          </div>

          <Badge color={status.color} variant="light" size="lg" radius="sm">
            {status.label}
          </Badge>
        </Group>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Text size="xs" tt="uppercase" c="dimmed">
              Email
            </Text>
            <Text>{application.email}</Text>
          </div>

          <div>
            <Text size="xs" tt="uppercase" c="dimmed">
              Телефон
            </Text>
            <Text>{application.phone}</Text>
          </div>

          <div className="sm:col-span-2">
            <Text size="xs" tt="uppercase" c="dimmed">
              Адрес
            </Text>
            <Text>{application.address}</Text>
          </div>

          <div className="sm:col-span-2">
            <Text size="xs" tt="uppercase" c="dimmed">
              Создана
            </Text>
            <Text>{formatDate(application.createdAt)}</Text>
          </div>
        </div>
      </Stack>
    </Card>
  )
}

export function ApplicationsPage() {
  const user = useAuthStore((state) => state.user)
  const refreshToken = useAuthStore((state) => state.refreshToken)
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const isOwner = user?.role === UserRole.OWNER
  const navigate = useNavigate()
  const { mutate: logout, isPending: isLoggingOut } = useLogoutMutation(() => {
    navigate(ROUTES.AUTH, { replace: true })
  })
  const { data, isLoading, isError, error } = useApplicationsListQuery(isOwner)

  if (!isOwner) {
    return <Navigate to={ROUTES.RESTAURANTS} replace />
  }

  const handleLogout = () => {
    if (!refreshToken) {
      clearAuth()
      navigate(ROUTES.AUTH, { replace: true })
      return
    }

    logout({ refreshToken })
  }

  return (
    <section className="relative isolate flex min-h-full w-full flex-1 overflow-hidden bg-white rounded-2xl">
      <div className="relative flex w-full flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col overflow-hidden sm:px-8 lg:px-10">
          <div className="relative flex flex-col gap-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex flex-col gap-3">
                <Badge
                  color="aurora"
                  variant="light"
                  size="lg"
                  radius="sm"
                  w="fit-content"
                >
                  Кабинет owner
                </Badge>
                <Title order={1}>Все заявки</Title>
                <Text maw={640} c="dimmed">
                  Здесь отображаются все заявки на подключение ресторанов с
                  текущими статусами и контактами заявителей.
                </Text>
              </div>

              <Button
                variant="default"
                radius="md"
                onClick={handleLogout}
                loading={isLoggingOut}
              >
                Logout
              </Button>
            </div>

            {isLoading ? (
              <div className="flex min-h-64 items-center justify-center">
                <Loader color="var(--mantine-color-aurora-6)" size="lg" />
              </div>
            ) : null}

            {isError ? (
              <Alert
                color="red"
                radius="lg"
                title="Не удалось загрузить заявки"
                icon={<IoAlertCircle size={18} />}
              >
                {getApiErrorMessage(error)}
              </Alert>
            ) : null}

            {!isLoading && !isError && data?.length === 0 ? (
              <Card
                radius="xl"
                padding="xl"
                className="border border-dashed border-slate-200 bg-white/80"
              >
                <Text fw={600}>Заявок пока нет</Text>
                <Text c="dimmed" size="sm">
                  Как только кто-то отправит заявку, она появится на этой
                  странице.
                </Text>
              </Card>
            ) : null}

            {!isLoading && !isError && data?.length ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {data.map((application) => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
