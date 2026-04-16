import {
  RestaurantInfoRow,
  declineMinuteTitle,
  getRestaurantAddress,
  getRestaurantPrimaryPhone
} from '@/entities/restaurant'
import type { Restaurant } from '@/shared/api/services/restaurant/types'
import {
  Card,
  Divider,
  Group,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title
} from '@mantine/core'
import { FiClock, FiMail, FiMapPin, FiPhone } from 'react-icons/fi'
import { TbBuildingStore } from 'react-icons/tb'

type RestaurantInfoCardProps = {
  restaurant: Restaurant
}

export function RestaurantInfoCard({ restaurant }: RestaurantInfoCardProps) {
  const phone = getRestaurantPrimaryPhone(restaurant)
  const address = getRestaurantAddress(restaurant)

  return (
    <Card withBorder radius={24} padding="xl" className="bg-white">
      <Group gap="sm" mb="md">
        <ThemeIcon variant="light" size={38} radius="xl">
          <TbBuildingStore size={20} />
        </ThemeIcon>
        <div>
          <Title order={4}>Основная информация</Title>
          <Text size="sm" c="dimmed">
            Контакты, адрес и параметры доставки
          </Text>
        </div>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg" mt={20}>
        <RestaurantInfoRow
          icon={<FiPhone size={16} />}
          label="Телефон"
          value={phone || 'Телефон не указан'}
        />
        <RestaurantInfoRow
          icon={<FiMail size={16} />}
          label="Email"
          value={restaurant.email || 'Email не указан'}
        />
        <RestaurantInfoRow
          icon={<FiMapPin size={16} />}
          label="Адрес"
          value={address || 'Адрес не указан'}
        />
        <RestaurantInfoRow
          icon={<FiClock size={16} />}
          label="Доставка"
          value={declineMinuteTitle(restaurant.deliveryTime)}
        />
      </SimpleGrid>

      <Divider my="lg" />

      <Stack gap="sm">
        <Text size="md" fw={600} className="text-moss-900" tt="uppercase">
          Условия доставки
        </Text>
        <Text size="sm" className="leading-7 text-moss-700">
          {restaurant.deliveryConditions || 'Условия доставки не указаны'}
        </Text>
      </Stack>
    </Card>
  )
}
