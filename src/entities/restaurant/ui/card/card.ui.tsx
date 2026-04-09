import type { Restaurant } from '@/shared/api/services/restaurant/types'
import { getRestaurantDetailsRoute } from '@/shared/config/routes'
import { resolveMediaUrl } from '@/shared/lib/helpers/media'
import {
  Avatar,
  Badge,
  Button,
  Card,
  Group,
  Image,
  Stack,
  Text,
  Title
} from '@mantine/core'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import {
  getRestaurantActivityMeta,
  getRestaurantModerationStatusMeta
} from '../../model/utils'

type Props = {
  data: Restaurant
  renderActions?: (item: Restaurant) => ReactNode
}

export function RestaurantCard({ data, renderActions }: Props) {
  const moderationStatus = getRestaurantModerationStatusMeta(data.status)
  const activityStatus = getRestaurantActivityMeta(data.isActive)
  const cuisine = data.cuisine.length
    ? data.cuisine.join(' • ')
    : 'Кухня не указана'
  const description = data.description?.trim() || 'Описание пока не заполнено'

  return (
    <Card
      withBorder
      radius={20}
      padding={0}
      className="overflow-hidden bg-white transition-all duration-200 hover:shadow-md"
    >
      <Stack>
        <div className="relative h-48 overflow-hidden bg-moss-100">
          <Image
            src={resolveMediaUrl(data.preview)}
            alt={`Превью ресторана ${data.name}`}
            h="100%"
            w="100%"
            fit="cover"
            fallbackSrc="https://placehold.co/1200x600?text=Preview"
          />
          <div className="absolute inset-0 bg-linear-to-t from-moss-900/30 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4">
            <Avatar
              src={resolveMediaUrl(data.logo)}
              radius="xl"
              size={54}
              className="border-2 border-white/80 shadow-md"
            />
          </div>
        </div>

        <Stack gap="sm" p="lg" pt={0}>
          <Group justify="space-between" align="flex-start" gap="md">
            <Group gap="xs" wrap="wrap">
              <Badge color={moderationStatus.color} variant="light" size="lg">
                {moderationStatus.label}
              </Badge>
              <Badge color={activityStatus.color} variant="dot" size="lg">
                {activityStatus.label}
              </Badge>
            </Group>

            {renderActions ? (
              <div className="shrink-0">{renderActions(data)}</div>
            ) : null}
          </Group>

          <Stack gap={3} className="min-w-0">
            <Title order={3} className="text-moss-900">
              {data.name}
            </Title>
            <Text size="sm" fw={500} className="text-moss-600">
              {cuisine}
            </Text>
          </Stack>

          <Text size="sm" c="dimmed" className="line-clamp-3">
            {description}
          </Text>

          <Button
            component={Link}
            to={getRestaurantDetailsRoute(data.id)}
            fullWidth
          >
            Открыть ресторан
          </Button>
        </Stack>
      </Stack>
    </Card>
  )
}
