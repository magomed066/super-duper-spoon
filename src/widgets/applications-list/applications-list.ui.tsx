import {
  ApplicationsEmptyPlaceholder,
  applicationStatus,
  useApproveApplicationMutation,
  useApplicationsListQuery,
  useRejectApplicationMutation
} from '@/entities/application'
import { useAuthStore } from '@/entities/auth'
import { ApplicationStatus } from '@/shared/api/services/application/types'
import { UserRole } from '@/shared/api/services/auth/types'
import {
  ActionIcon,
  Badge,
  Card,
  CardSection,
  Divider,
  Group,
  Loader,
  Menu,
  SimpleGrid,
  Stack,
  Text
} from '@mantine/core'
import {
  TbBuildingStore,
  TbDots,
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
  const isOwner = user?.role === UserRole.OWNER

  const { data, isLoading } = useApplicationsListQuery(isOwner)
  const approveMutation = useApproveApplicationMutation()
  const rejectMutation = useRejectApplicationMutation()

  const handleApprove = (id: string, restaurantName: string) => {
    const isConfirmed = window.confirm(
      `Подтвердить заявку ресторана «${restaurantName}»? Будет создан аккаунт клиента.`
    )

    if (!isConfirmed) {
      return
    }

    approveMutation.mutate(id)
  }

  const handleReject = (id: string, restaurantName: string) => {
    const isConfirmed = window.confirm(
      `Отклонить заявку ресторана «${restaurantName}»?`
    )

    if (!isConfirmed) {
      return
    }

    rejectMutation.mutate(id)
  }

  if (!data) {
    return <ApplicationsEmptyPlaceholder />
  }

  return (
    <Stack className="w-full">
      {isLoading && <Loader className="mx-auto" />}

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

                  <Menu withinPortal position="bottom-end" shadow="sm">
                    <Menu.Target>
                      <ActionIcon variant="subtle" color="gray" radius="xl">
                        <TbDots size={16} />
                      </ActionIcon>
                    </Menu.Target>

                    <Menu.Dropdown>
                      <Menu.Item
                        disabled={!isPending || isActionLoading}
                        onClick={() =>
                          handleApprove(item.id, item.restaurantName)
                        }
                      >
                        Подтвердить
                      </Menu.Item>
                      <Menu.Item
                        color="red"
                        disabled={!isPending || isActionLoading}
                        onClick={() =>
                          handleReject(item.id, item.restaurantName)
                        }
                      >
                        Отказать
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
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
