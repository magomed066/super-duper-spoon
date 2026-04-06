import {
  ApplicationsEmptyPlaceholder,
  applicationStatus,
  useApplicationsListQuery
} from '@/entities/application'
import { useAuthStore } from '@/entities/auth'
import { UserRole } from '@/shared/api/services/auth/types'
import {
  ActionIcon,
  Badge,
  Card,
  CardSection,
  Group,
  Loader,
  Menu,
  Stack,
  Text
} from '@mantine/core'
import { TbDots } from 'react-icons/tb'

export function ApplicationsListWidget() {
  const user = useAuthStore((state) => state.user)
  const isOwner = user?.role === UserRole.OWNER

  const { data, isLoading } = useApplicationsListQuery(isOwner)

  if (!data) {
    return <ApplicationsEmptyPlaceholder />
  }

  return (
    <Stack className="w-full">
      {isLoading && <Loader className="mx-auto" />}

      <div className="grid grid-cols-4 gap-4">
        {data.map((item) => {
          const status = applicationStatus[item.status]

          return (
            <Card withBorder key={item.id}>
              <CardSection inheritPadding withBorder py="xs">
                <Group justify="space-between">
                  <Badge color={status.color}>{status.label}</Badge>

                  <Menu withinPortal position="bottom-end" shadow="sm">
                    <Menu.Target>
                      <ActionIcon variant="subtle" color="gray">
                        <TbDots size={16} />
                      </ActionIcon>
                    </Menu.Target>

                    <Menu.Dropdown>
                      <Menu.Item>Download zip</Menu.Item>
                      <Menu.Item>Preview all</Menu.Item>
                      <Menu.Item color="red">Delete all</Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>
              </CardSection>

              <Text>
                {item.email}
                {item.address}
                {item.phone}
                {item.restaurantName}
              </Text>
            </Card>
          )
        })}
      </div>
    </Stack>
  )
}
