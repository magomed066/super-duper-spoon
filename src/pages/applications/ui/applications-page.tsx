import {
  Alert,
  Badge,
  Card,
  Group,
  Loader,
  Stack,
  Text,
  Title
} from '@mantine/core'
import { Navigate } from 'react-router-dom'
import { IoAlertCircle } from 'react-icons/io5'
import { useApplicationsListQuery } from '@/entities/application'
import { useAuthStore } from '@/entities/auth'
import { getApiErrorMessage } from '@/shared/api/errors'
import {
  ApplicationStatus,
  type RequestClient
} from '@/shared/api/services/application/types'
import { UserRole } from '@/shared/api/services/auth/types'
import { ROUTES } from '@/shared/config/routes'

const statusMeta: Record<ApplicationStatus, { color: string; label: string }> =
  {
    [ApplicationStatus.PENDING]: {
      color: 'yellow',
      label: 'На рассмотрении'
    },
    [ApplicationStatus.APPROVED]: {
      color: 'green',
      label: 'Одобрена'
    },
    [ApplicationStatus.REJECTED]: {
      color: 'red',
      label: 'Отклонена'
    }
  }

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
  const status = statusMeta[application.status]

  return (
    <Card
      radius="xl"
      padding="xl"
      shadow="sm"
      className="border border-white/70 bg-white/90 backdrop-blur"
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
  const isOwner = user?.role === UserRole.OWNER
  const { data, isLoading, isError, error } = useApplicationsListQuery(isOwner)

  if (!isOwner) {
    return <Navigate to={ROUTES.RESTAURANTS} replace />
  }

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-linear-to-br from-slate-50 via-white to-aurora-50/70 px-6 py-8 shadow-[0_32px_80px_rgba(15,23,42,0.08)] sm:px-8 lg:px-10">
      <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-r from-aurora-100/60 via-transparent to-moss-100/60 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8">
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
            Здесь отображаются все заявки на подключение ресторанов с текущими
            статусами и контактами заявителей.
          </Text>
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
              Как только кто-то отправит заявку, она появится на этой странице.
            </Text>
          </Card>
        ) : null}

        {!isLoading && !isError && data?.length ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {data.map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
