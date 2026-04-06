import type { Restaurant } from '@/shared/api/services/restaurant/types'
import { DD_MM_YYYY_TIME } from '@/shared/lib/helpers/constants'
import { Badge, Card, Group, Image, Stack, Text } from '@mantine/core'
import type { ReactNode } from 'react'
import moment from 'moment'
import { BsCalendar2Date } from 'react-icons/bs'
import { TbBuildingStore, TbClock } from 'react-icons/tb'
import { RestaurantInfoRow } from '../info-row/info-row.ui'

type Props = {
  data: Restaurant
  renderActions?: (item: Restaurant) => ReactNode
}

const getWorkScheduleLabel = (restaurant: Restaurant) => {
  if (!restaurant.workSchedule.length) {
    return 'Не указано'
  }

  const firstItem = restaurant.workSchedule[0]

  if (!firstItem?.open || !firstItem?.close) {
    return 'Не указано'
  }

  return `${firstItem.open} - ${firstItem.close}`
}

export function RestaurantCard({ data, renderActions }: Props) {
  return (
    <Card
      withBorder
      radius="lg"
      padding={0}
      className="h-full bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
    >
      <Stack gap={0} h="100%">
        <div className="relative">
          <Image
            src={data.preview}
            alt={`Превью ресторана ${data.name}`}
            h={220}
            fallbackSrc="https://placehold.co/1200x600?text=No+Preview"
          />
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/65 via-black/25 to-transparent px-5 pb-5 pt-10">
            <Group justify="space-between" align="flex-end" wrap="nowrap">
              <Stack gap={6} className="min-w-0 pl-20">
                <Group gap="xs" wrap="nowrap">
                  <TbBuildingStore size={20} className="shrink-0 text-white" />
                  <Text
                    fw={700}
                    fz="lg"
                    c="white"
                    className="wrap-break-word leading-snug"
                  >
                    {data.name}
                  </Text>
                </Group>
              </Stack>

              <Badge
                color={data.isActive ? 'green' : 'coral'}
                variant="light"
                size="lg"
              >
                {data.isActive ? 'Активен' : 'Неактивен'}
              </Badge>
            </Group>
          </div>
          {renderActions ? (
            <div className="absolute right-4 top-4 z-10">{renderActions(data)}</div>
          ) : null}
          <div className="absolute bottom-4 left-4 z-10 h-16 w-16 overflow-hidden rounded-xl border-2 border-white bg-white shadow-lg">
            <Image
              src={data.logo}
              alt={`Логотип ресторана ${data.name}`}
              h="100%"
              w="100%"
              fit="cover"
              fallbackSrc="https://placehold.co/128x128?text=Logo"
            />
          </div>
        </div>

        <Stack gap="md" p="lg" pt="xl">
          <RestaurantInfoRow
            icon={<TbClock size={18} />}
            label="Время работы"
            value={getWorkScheduleLabel(data)}
          />
          <RestaurantInfoRow
            icon={<BsCalendar2Date size={18} />}
            label="Создан"
            value={moment(data.createdAt).format(DD_MM_YYYY_TIME)}
          />
        </Stack>
      </Stack>
    </Card>
  )
}
