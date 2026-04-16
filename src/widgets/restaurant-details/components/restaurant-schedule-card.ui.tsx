import { getRestaurantWeekdayLabel } from '@/entities/restaurant'
import type { Restaurant } from '@/shared/api/services/restaurant/types'
import {
  Card,
  Group,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title
} from '@mantine/core'
import { TbCalendarTime } from 'react-icons/tb'

type RestaurantScheduleCardProps = {
  restaurant: Restaurant
}

export function RestaurantScheduleCard({
  restaurant
}: RestaurantScheduleCardProps) {
  return (
    <Card withBorder radius={24} padding="xl" className="bg-white">
      <Group gap="sm" mb="md">
        <ThemeIcon variant="light" size={38} radius="xl">
          <TbCalendarTime size={20} />
        </ThemeIcon>
        <div>
          <Title order={4}>Расписание</Title>
          <Text size="sm" c="dimmed">
            Актуальные часы работы ресторана
          </Text>
        </div>
      </Group>

      <Stack gap="sm">
        {restaurant.workSchedule.length ? (
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
            {restaurant.workSchedule.map((item) => (
              <Card
                key={`${item.day}-${item.open}-${item.close}`}
                radius="xl"
                padding="md"
                className="bg-moss-50"
              >
                <Group justify="space-between" gap="sm">
                  <Text fw={600}>{getRestaurantWeekdayLabel(item.day)}</Text>
                  <Text size="sm" c="dimmed">
                    {item.open} - {item.close}
                  </Text>
                </Group>
              </Card>
            ))}
          </SimpleGrid>
        ) : (
          <Text size="sm" c="dimmed">
            Расписание пока не заполнено.
          </Text>
        )}
      </Stack>
    </Card>
  )
}
