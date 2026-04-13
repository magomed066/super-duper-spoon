import { RestaurantInfoRow } from '@/entities/restaurant'
import type { Restaurant } from '@/shared/api/services/restaurant/types'
import { Card, Stack, Title } from '@mantine/core'
import { FiClock, FiEdit2 } from 'react-icons/fi'
import { TbAlertCircle, TbWorld } from 'react-icons/tb'

type RestaurantStatusCardProps = {
  restaurant: Restaurant
  moderationStatus: {
    label: string
  }
  activityStatus: {
    label: string
  }
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(new Date(value))

export function RestaurantStatusCard({
  restaurant,
  moderationStatus,
  activityStatus
}: RestaurantStatusCardProps) {
  return (
    <Card withBorder radius={24} padding="xl" className="bg-white">
      <Title order={4}>Статус и публикация</Title>
      <Stack gap="sm" mt="md">
        <RestaurantInfoRow
          icon={<TbAlertCircle size={16} />}
          label="Модерация"
          value={moderationStatus.label}
        />
        <RestaurantInfoRow
          icon={<TbWorld size={16} />}
          label="Публикация"
          value={activityStatus.label}
        />
        <RestaurantInfoRow
          icon={<FiClock size={16} />}
          label="Создан"
          value={formatDate(restaurant.createdAt)}
        />
        <RestaurantInfoRow
          icon={<FiEdit2 size={16} />}
          label="Обновлён"
          value={formatDate(restaurant.updatedAt)}
        />
      </Stack>
    </Card>
  )
}
