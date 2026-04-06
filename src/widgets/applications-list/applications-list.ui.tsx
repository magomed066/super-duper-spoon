import {
  ApplicationsEmptyPlaceholder,
  applicationStatus,
  useApproveApplicationMutation,
  useApplicationsListQuery,
  useRejectApplicationMutation
} from '@/entities/application'
import { AuthPermission, hasPermission, useAuthStore } from '@/entities/auth'
import { getApiErrorMessage } from '@/shared/api/errors'
import {
  ApplicationStatus,
  type RequestClient
} from '@/shared/api/services/application/types'
import MenuActions from '@/shared/ui/menu'
import {
  Alert,
  ActionIcon,
  Badge,
  Card,
  CardSection,
  Divider,
  Group,
  Loader,
  SimpleGrid,
  Stack,
  Text
} from '@mantine/core'
import {
  TbAlertCircle,
  TbBuildingStore,
  TbMail,
  TbMapPin,
  TbPhone,
  TbUser
} from 'react-icons/tb'
import type { ReactNode } from 'react'

function InfoRow({
  icon,
  label,
  value
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <Group align="flex-start" gap="sm" wrap="nowrap">
      <ActionIcon
        aria-hidden
        variant="light"
        color="gray"
        radius="xl"
        size="lg"
        className="shrink-0 hover:cursor-none"
      >
        {icon}
      </ActionIcon>

      <div className="min-w-0">
        <Text c="dimmed" fz="xs" fw={500}>
          {label}
        </Text>
        <Text fz="sm" fw={500} className="wrap-break-word">
          {value}
        </Text>
      </div>
    </Group>
  )
}

export function ApplicationsListWidget() {
  const user = useAuthStore((state) => state.user)
  const canViewApplications = hasPermission(user, AuthPermission.VIEW_APPLICATIONS)
  const canManageApplications = hasPermission(
    user,
    AuthPermission.MANAGE_APPLICATIONS
  )

  const { data, error, isError, isLoading } =
    useApplicationsListQuery(canViewApplications)
  const approveMutation = useApproveApplicationMutation()
  const rejectMutation = useRejectApplicationMutation()

  const handleApprove = (id: string, restaurantName: string) => {
    if (!canManageApplications) {
      return
    }

    const isConfirmed = window.confirm(
      `Подтвердить заявку ресторана «${restaurantName}»? Будет создан аккаунт клиента.`
    )

    if (!isConfirmed) {
      return
    }

    approveMutation.mutate(id)
  }

  const handleReject = (id: string, restaurantName: string) => {
    if (!canManageApplications) {
      return
    }

    const isConfirmed = window.confirm(
      `Отклонить заявку ресторана «${restaurantName}»?`
    )

    if (!isConfirmed) {
      return
    }

    rejectMutation.mutate(id)
  }

  const getMenuActions = (
    isPending: boolean,
    isActionLoading: boolean,
    item: RequestClient
  ) => {
    return [
      {
        key: 'approve',
        label: 'Подтвердить',
        disabled: !canManageApplications || !isPending || isActionLoading,
        onClick: () => handleApprove(item.id, item.restaurantName)
      },
      {
        key: 'reject',
        label: 'Отказать',
        color: 'red',
        disabled: !canManageApplications || !isPending || isActionLoading,
        onClick: () => handleReject(item.id, item.restaurantName)
      }
    ]
  }

  if (isError) {
    return (
      <Alert
        color="red"
        radius="lg"
        title="Не удалось загрузить заявки"
        icon={<TbAlertCircle size={18} />}
      >
        {getApiErrorMessage(error)}
      </Alert>
    )
  }

  if (isLoading) {
    return <Loader className="mx-auto" />
  }

  if (!data?.length) {
    return <ApplicationsEmptyPlaceholder />
  }

  return (
    <Stack className="w-full">
      <SimpleGrid cols={{ base: 1, sm: 2, xl: 4 }} spacing="lg">
        {data.map((item) => {
          const status = applicationStatus[item.status]
          const isPending = item.status === ApplicationStatus.PENDING
          const isActionLoading =
            approveMutation.isPending || rejectMutation.isPending

          return (
            <Card
              withBorder
              key={item.id}
              radius="lg"
              padding="lg"
              className="h-full bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
            >
              <CardSection
                inheritPadding
                py="md"
                className="bg-[linear-gradient(135deg,rgba(13,79,220,0.08),rgba(16,19,31,0.02))]"
              >
                <Group justify="space-between">
                  <Badge color={status.color} size="lg" variant="light">
                    {status.label}
                  </Badge>

                  {canManageApplications ? (
                    <MenuActions
                      items={getMenuActions(isPending, isActionLoading, item)}
                    />
                  ) : null}
                </Group>

                <Stack gap={6} mt="lg">
                  <Group gap="xs" wrap="nowrap">
                    <TbBuildingStore
                      size={18}
                      className="shrink-0 text-aurora-500"
                    />
                    <Text
                      fw={700}
                      fz="lg"
                      className="wrap-break-word leading-snug"
                    >
                      {item.restaurantName}
                    </Text>
                  </Group>

                  <Text c="dimmed" fz="sm">
                    Заявка на подключение ресторана
                  </Text>
                </Stack>
              </CardSection>

              <Stack gap="md" mt="md">
                <InfoRow
                  icon={<TbUser size={16} />}
                  label="Контактное лицо"
                  value={item.name}
                />
                <InfoRow
                  icon={<TbMail size={16} />}
                  label="Email"
                  value={item.email}
                />
                <InfoRow
                  icon={<TbPhone size={16} />}
                  label="Телефон"
                  value={item.phone}
                />

                <Divider />

                <InfoRow
                  icon={<TbMapPin size={16} />}
                  label="Адрес ресторана"
                  value={item.address}
                />
              </Stack>
            </Card>
          )
        })}
      </SimpleGrid>
    </Stack>
  )
}
