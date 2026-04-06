import type { Restaurant } from '@/shared/api/services/restaurant/types'
import { resolveMediaUrl } from '@/shared/lib/helpers/media'
import { Badge, Card, Flex, Group, Image, Stack, Text } from '@mantine/core'
import type { ReactNode } from 'react'
import { IoMdRestaurant } from 'react-icons/io'

type Props = {
  data: Restaurant
  renderActions?: (item: Restaurant) => ReactNode
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
            src={resolveMediaUrl(data.preview)}
            alt={`Превью ресторана ${data.name}`}
            h={220}
            fallbackSrc="https://placehold.co/1200x600?text=No+Preview"
          />
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/65 via-black/25 to-transparent px-5 pb-5 pt-10">
            <Group justify="space-between" align="flex-end" wrap="nowrap">
              <Stack gap={6} className="min-w-0 pl-18">
                <Group gap="xs" wrap="nowrap"></Group>
              </Stack>
            </Group>
          </div>
          {renderActions ? (
            <div className="absolute right-4 top-4 z-10">
              {renderActions(data)}
            </div>
          ) : null}
          <div className="absolute bottom-4 left-4 z-10 h-16 w-16 overflow-hidden rounded-xl border-2 border-white bg-white shadow-lg">
            <Image
              src={resolveMediaUrl(data.logo)}
              alt={`Логотип ресторана ${data.name}`}
              h="100%"
              w="100%"
              fit="cover"
              fallbackSrc="https://placehold.co/128x128?text=Logo"
            />
          </div>
        </div>

        <Stack gap="md" p="lg" pt="lg" className="relative">
          <Flex direction="column">
            <Flex align="center" justify="space-between">
              <Text
                className="text-moss-900 flex items-center"
                size="lg"
                fw={500}
              >
                <IoMdRestaurant className="mr-2" />
                {data.name}
              </Text>
              <Badge
                color={data.isActive ? 'green' : 'coral'}
                variant="light"
                size="md"
              >
                {data.isActive ? 'Активен' : 'Неактивен'}
              </Badge>
            </Flex>

            <div className="flex mt-1">
              {data.cuisine.map((item, i) => (
                <div className="flex">
                  <Text size="sm" className="text-moss-700">
                    {item}
                  </Text>
                  <Text size="sm" mx={3} className=" text-moss-700">
                    {data.cuisine.length - 1 !== i ? '•' : ''}
                  </Text>
                </div>
              ))}
            </div>

            <Text className="text-moss-700 line-clamp-3" mt={12} size="sm">
              {data.description}
            </Text>
          </Flex>
        </Stack>
      </Stack>
    </Card>
  )
}
