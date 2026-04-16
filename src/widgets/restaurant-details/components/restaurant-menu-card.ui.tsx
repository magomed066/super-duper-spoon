import { useCategoriesQuery } from '@/entities/category'
import { useMenuItemsQuery } from '@/entities/menu'
import { getApiErrorMessage } from '@/shared/api/errors'
import type { Category } from '@/shared/api/services/category/types'
import type { MenuItem } from '@/shared/api/services/menu-item/types'
import { priceFormatter } from '@/shared/lib/helpers/price-formatter'
import { resolveMediaUrl } from '@/shared/lib/helpers/media'
import {
  Alert,
  Avatar,
  Badge,
  Card,
  Flex,
  Group,
  Loader,
  Stack,
  Text,
  ThemeIcon,
  Title
} from '@mantine/core'
import { TbAlertCircle, TbPhoto, TbSoup } from 'react-icons/tb'

type RestaurantMenuCardProps = {
  restaurantId: string
}

const uncategorizedCategoryId = '__uncategorized__'

const uncategorizedCategory: Category = {
  id: uncategorizedCategoryId,
  name: 'Без категории',
  description: null,
  isActive: true,
  restaurantId: '',
  sortOrder: Number.MAX_SAFE_INTEGER,
  createdAt: '',
  updatedAt: ''
}

const sortByOrder = <T extends { sortOrder: number }>(items: T[]) =>
  [...items].sort((left, right) => left.sortOrder - right.sortOrder)

export function RestaurantMenuCard({
  restaurantId
}: RestaurantMenuCardProps) {
  const {
    data: menuItems,
    error: menuError,
    isError: isMenuError,
    isLoading: isMenuLoading
  } = useMenuItemsQuery(restaurantId, Boolean(restaurantId))
  const {
    data: categories,
    error: categoriesError,
    isError: isCategoriesError,
    isLoading: isCategoriesLoading
  } = useCategoriesQuery(restaurantId, Boolean(restaurantId))

  const sortedCategories = sortByOrder(categories ?? [])
  const sortedMenuItems = sortByOrder(menuItems ?? [])
  const visibleCategories = sortedCategories.filter((category) =>
    sortedMenuItems.some((item) => item.categoryId === category.id)
  )
  const uncategorizedItems = sortedMenuItems.filter(
    (item) => !sortedCategories.some((category) => category.id === item.categoryId)
  )
  const menuSections = uncategorizedItems.length
    ? [...visibleCategories, uncategorizedCategory]
    : visibleCategories
  const getItemsByCategory = (categoryId: string): MenuItem[] =>
    categoryId === uncategorizedCategoryId
      ? uncategorizedItems
      : sortedMenuItems.filter((item) => item.categoryId === categoryId)

  return (
    <Card withBorder radius={24} padding="xl" className="bg-white">
      <Group gap="sm" mb="md">
        <ThemeIcon variant="light" size={38} radius="xl">
          <TbSoup size={20} />
        </ThemeIcon>
        <div>
          <Title order={4}>Меню ресторана</Title>
          <Text size="sm" c="dimmed">
            Категории и блюда, доступные в меню ресторана
          </Text>
        </div>
      </Group>

      {isMenuError || isCategoriesError ? (
        <Alert
          color="coral"
          radius="md"
          title="Не удалось загрузить меню"
          icon={<TbAlertCircle size={18} />}
        >
          {getApiErrorMessage(menuError ?? categoriesError)}
        </Alert>
      ) : isMenuLoading || isCategoriesLoading ? (
        <Flex justify="center" py="lg">
          <Loader />
        </Flex>
      ) : sortedMenuItems.length ? (
        <Stack gap="lg">
          {menuSections.map((category) => {
            const items = getItemsByCategory(category.id)

            return (
              <Card
                key={category.id}
                withBorder
                radius="lg"
                padding="lg"
                className="bg-[#fcfaf6]"
              >
                <Stack gap="md">
                  <div className="border-b border-moss-200 pb-3">
                    <Title order={5} className="text-moss-900">
                      {category.name}
                    </Title>
                    {category.description?.trim() ? (
                      <Text size="sm" className="mt-2 text-moss-600">
                        {category.description}
                      </Text>
                    ) : null}
                  </div>

                  <Stack gap="sm">
                    {items.map((item) => (
                      <Card
                        key={item.id}
                        withBorder
                        radius="lg"
                        padding="md"
                        className="bg-white"
                      >
                        <Group align="flex-start" gap="md" wrap="nowrap">
                          {item.image ? (
                            <Avatar
                              src={resolveMediaUrl(item.image)}
                              alt={item.name}
                              radius="lg"
                              size={72}
                            />
                          ) : (
                            <Flex
                              align="center"
                              justify="center"
                              className="h-[72px] w-[72px] shrink-0 rounded-2xl bg-moss-50 text-moss-500"
                            >
                              <TbPhoto size={28} />
                            </Flex>
                          )}

                          <Stack gap={6} className="min-w-0 flex-1">
                            <Group justify="space-between" gap="sm">
                              <Text
                                fw={600}
                                className="min-w-0 flex-1 text-moss-900"
                              >
                                {item.name}
                              </Text>
                              <Text fw={700} className="shrink-0 text-moss-900">
                                {priceFormatter.format(item.price)}
                              </Text>
                            </Group>

                            <Text
                              size="sm"
                              className="whitespace-pre-line text-moss-700"
                            >
                              {item.description?.trim() ||
                                'Описание блюда пока не заполнено.'}
                            </Text>

                            {!item.isActive ? (
                              <Badge
                                variant="light"
                                color="gray"
                                className="self-start"
                              >
                                Скрыто в меню
                              </Badge>
                            ) : null}
                          </Stack>
                        </Group>
                      </Card>
                    ))}
                  </Stack>
                </Stack>
              </Card>
            )
          })}
        </Stack>
      ) : (
        <Text size="sm" c="dimmed">
          В меню пока нет блюд.
        </Text>
      )}
    </Card>
  )
}
