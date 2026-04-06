import {
  ApplicationsEmptyPlaceholder,
  useApplicationsListQuery,
  ApplicationCard
} from '@/entities/application'
import { AuthPermission, hasPermission, useAuthStore } from '@/entities/auth'
import { getApiErrorMessage } from '@/shared/api/errors'
import { Alert, Loader, SimpleGrid, Stack } from '@mantine/core'
import { TbAlertCircle } from 'react-icons/tb'
import ApplicationActions from '@/features/application/application-actions'

export function ApplicationsListWidget() {
  const user = useAuthStore((state) => state.user)
  const canViewApplications = hasPermission(
    user,
    AuthPermission.VIEW_APPLICATIONS
  )

  const { data, error, isError, isLoading } =
    useApplicationsListQuery(canViewApplications)

  if (isError) {
    return (
      <Alert
        color="coral"
        radius="md"
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
        {data.map((item) => (
          <ApplicationCard
            key={item.id}
            data={item}
            renderActions={(item) => (
              <ApplicationActions key={item.id} data={item} />
            )}
          />
        ))}
      </SimpleGrid>
    </Stack>
  )
}
