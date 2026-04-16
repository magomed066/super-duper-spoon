import {
  getRestaurantActivityMeta,
  getRestaurantModerationStatusMeta,
  useRestaurantQuery
} from '@/entities/restaurant'
import { getApiErrorMessage } from '@/shared/api/errors'
import { Alert, Grid, Loader, Stack } from '@mantine/core'
import { TbAlertCircle } from 'react-icons/tb'
import {
  RestaurantHero,
  RestaurantInfoCard,
  RestaurantMenuCard,
  RestaurantScheduleCard,
  RestaurantStatusCard
} from './components'

type Props = {
  id: string
}

export function RestaurantDetailsWidget({ id }: Props) {
  const { data, error, isError, isLoading } = useRestaurantQuery(
    id,
    Boolean(id)
  )

  if (isLoading) {
    return <Loader className="mx-auto mt-10" />
  }

  if (isError) {
    return (
      <Alert
        color="coral"
        radius="md"
        title="Не удалось загрузить ресторан"
        icon={<TbAlertCircle size={18} />}
      >
        {getApiErrorMessage(error)}
      </Alert>
    )
  }

  if (!data) {
    return null
  }

  const moderationStatus = getRestaurantModerationStatusMeta(data.status)
  const activityStatus = getRestaurantActivityMeta(data.isActive)

  return (
    <Stack gap="lg">
      <RestaurantHero
        restaurant={data}
        moderationStatus={moderationStatus}
        activityStatus={activityStatus}
      />

      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="lg">
            <RestaurantInfoCard restaurant={data} />
            <RestaurantMenuCard restaurantId={id} />
            <RestaurantScheduleCard restaurant={data} />
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack gap="lg">
            <RestaurantStatusCard
              restaurant={data}
              moderationStatus={moderationStatus}
              activityStatus={activityStatus}
            />
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  )
}
