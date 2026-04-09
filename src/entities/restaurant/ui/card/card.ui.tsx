import type { Restaurant } from '@/shared/api/services/restaurant/types'
import { resolveMediaUrl } from '@/shared/lib/helpers/media'
import {
  Avatar,
  Badge,
  Card,
  Flex,
  Group,
  Image,
  Stack,
  Text,
  Title
} from '@mantine/core'
import type { ReactNode } from 'react'
import { TbClockHour4, TbMapPin, TbTruckDelivery } from 'react-icons/tb'
import {
  declineMinuteTitle,
  formatRestaurantSchedule,
  getRestaurantActivityMeta,
  getRestaurantAddress,
  getRestaurantModerationStatusMeta,
  getRestaurantPrimaryPhone
} from '../../model/utils'

type Props = {
  data: Restaurant
  renderActions?: (item: Restaurant) => ReactNode
}

export function RestaurantCard({ data, renderActions }: Props) {
  const address = getRestaurantAddress(data)
  const phone = getRestaurantPrimaryPhone(data)
  const secondaryInfo = [phone, data.email].filter(Boolean).join(' • ')
  const cuisine = data.cuisine.length
    ? data.cuisine.join(' • ')
    : 'Кухня не указана'
  const moderationStatus = getRestaurantModerationStatusMeta(data.status)
  const activityStatus = getRestaurantActivityMeta(data.isActive)
  const schedule = formatRestaurantSchedule(data)
  const deliveryTime = declineMinuteTitle(data.deliveryTime)
  const description = data.description?.trim() || 'Описание пока не заполнено'

  const createdAt = new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(data.createdAt))

  return (
    <Card
      withBorder
      radius={20}
      padding={0}
      className=" overflow-hidden cursor-pointer bg-white transition-all duration-200 hover:shadow-md"
    >
      <Stack h="100%" gap={0}>
        <div className="relative h-46 overflow-hidden bg-moss-100">
          <Image
            src={resolveMediaUrl(data.preview)}
            alt={`Превью ресторана ${data.name}`}
            h="100%"
            w="100%"
            fit="cover"
            fallbackSrc="https://placehold.co/1200x600?text=Preview"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/35 via-black/10 to-transparent" />
          <div className="absolute left-4 top-4">
            <Avatar
              src={resolveMediaUrl(data.logo)}
              radius="xl"
              w={58}
              h={58}
            />
          </div>
        </div>

        <Stack gap="sm" className="min-h-0 flex-1 px-6 py-5">
          <Flex align="flex-start" justify="space-between" gap={12}>
            <div className="min-w-0 flex-1">
              <Title order={3} fw={600} className="truncate text-moss-950">
                {data.name}
              </Title>

              <Text c="dimmed" size="sm" mt={4} className="line-clamp-1">
                {address || 'Адрес не указан'}
              </Text>
            </div>

            {renderActions ? (
              <div className="shrink-0">{renderActions(data)}</div>
            ) : null}
          </Flex>

          <Group gap="xs">
            <Badge color={moderationStatus.color} variant="light" size="md">
              {moderationStatus.label}
            </Badge>
            <Badge color={activityStatus.color} variant="dot" size="md">
              {activityStatus.label}
            </Badge>
          </Group>

          <Text size="sm" c="dimmed" className="line-clamp-1">
            {cuisine}
          </Text>

          <Text size="sm" className="line-clamp-2 text-moss-800">
            {description}
          </Text>

          {secondaryInfo ? (
            <Text size="sm" c="dimmed" className="line-clamp-2">
              {secondaryInfo}
            </Text>
          ) : null}

          <Stack gap={8}>
            <Group gap={8} wrap="nowrap" c="dimmed">
              <TbMapPin size={16} className="shrink-0" />
              <Text size="sm" className="line-clamp-1">
                {address || 'Адрес не указан'}
              </Text>
            </Group>

            <Group gap={8} wrap="nowrap" c="dimmed">
              <TbTruckDelivery size={16} className="shrink-0" />
              <Text size="sm" className="line-clamp-1">
                {deliveryTime}
                {data.deliveryConditions
                  ? ` • ${data.deliveryConditions}`
                  : ''}
              </Text>
            </Group>

            <Group gap={8} wrap="nowrap" c="dimmed">
              <TbClockHour4 size={16} className="shrink-0" />
              <Text size="sm" className="line-clamp-1">
                {schedule}
              </Text>
            </Group>
          </Stack>

          <Flex
            align="center"
            justify="space-between"
            mt="auto"
            className="border-t border-gray-200 pt-3"
          >
            <Group gap="sm" wrap="nowrap" className="min-w-0">
              <Group gap={6} wrap="nowrap" c="dimmed">
                <TbClockHour4 size={15} />
                <Text size="sm">Создан {createdAt}</Text>
              </Group>
            </Group>
          </Flex>
        </Stack>
      </Stack>
    </Card>
  )
}
