import RestaurantActions from '@/features/restaurant/restaurant-actions'
import type { Restaurant } from '@/shared/api/services/restaurant/types'
import { resolveMediaUrl } from '@/shared/lib/helpers/media'
import { Badge, Card, Group, Image, Stack, Text, Title } from '@mantine/core'

type RestaurantHeroProps = {
  restaurant: Restaurant
  moderationStatus: {
    label: string
    color: string
  }
  activityStatus: {
    label: string
    color: string
  }
}

export function RestaurantHero({
  restaurant,
  moderationStatus,
  activityStatus
}: RestaurantHeroProps) {
  const cuisine = restaurant.cuisine.length
    ? restaurant.cuisine.join(' • ')
    : 'Кухня не указана'

  return (
    <Card withBorder radius={24} padding={0} className="overflow-hidden bg-white">
      <div className="relative h-72 overflow-hidden bg-moss-100">
        <Image
          src={resolveMediaUrl(restaurant.preview)}
          alt={`Превью ресторана ${restaurant.name}`}
          h="100%"
          w="100%"
          fit="cover"
          fallbackSrc="https://placehold.co/1200x600?text=Preview"
        />
        <div className="absolute inset-0 bg-linear-to-t from-moss-950/70 via-moss-950/20 to-transparent" />
        <Image
          src={resolveMediaUrl(restaurant.logo)}
          alt={`Логотип ресторана ${restaurant.name}`}
          w={96}
          h={96}
          radius="24px"
          fit="cover"
          fallbackSrc="https://placehold.co/240x240?text=Logo"
          className="absolute bottom-5 left-5 overflow-hidden rounded-3xl border-4 border-white bg-white shadow-lg"
        />
      </div>

      <Stack gap="lg" p="xl">
        <Group gap="xs" wrap="wrap">
          <Badge color={moderationStatus.color} variant="light" size="lg">
            {moderationStatus.label}
          </Badge>
          <Badge color={activityStatus.color} variant="dot" size="lg">
            {activityStatus.label}
          </Badge>

          <div className="ml-auto">
            <Group gap="sm">
              <RestaurantActions
                data={restaurant}
                actionIconProps={{
                  variant: 'light',
                  color: 'gray',
                  className: 'bg-white hover:bg-moss-50'
                }}
              />
            </Group>
          </div>
        </Group>

        <Group justify="space-between" align="flex-start" gap="lg">
          <div>
            <Title
              order={2}
              className="text-[32px] tracking-[-0.03em] text-moss-900"
            >
              {restaurant.name}
            </Title>
            <Text className="mt-1 text-moss-600">{cuisine}</Text>
          </div>
        </Group>

        <Text
          size="sm"
          className="w-full max-w-6xl whitespace-pre-line wrap-break-word leading-7 text-moss-700"
        >
          {restaurant.description?.trim() || 'Описание ресторана пока не заполнено.'}
        </Text>
      </Stack>
    </Card>
  )
}
