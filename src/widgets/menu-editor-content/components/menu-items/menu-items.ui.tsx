import { useState } from 'react'
import { useCategoriesQuery } from '@/entities/category'
import {
  MenuItemRow,
  MenuItemsEmptyPlaceholder,
  useMenuQueryParams
} from '@/entities/menu'
import { useMenuItemsQuery } from '@/entities/menu/model/hooks'
import CreateMenuItemModal from '@/features/menu/create-menu-item-modal'
import { MenuItemActions } from '@/features/menu/menu-item-actions/ui/menu-item-actions'
import { getApiErrorMessage } from '@/shared/api/errors'
import { Alert, Button, Flex, Loader, Stack, Text } from '@mantine/core'
import { TbAlertCircle, TbPlus } from 'react-icons/tb'

export function MenuItemsWidget() {
  const { params } = useMenuQueryParams()
  const { restaurantId, categoryId } = params
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const { data, isError, error, isLoading } = useMenuItemsQuery(
    restaurantId,
    Boolean(restaurantId)
  )
  const { data: categories } = useCategoriesQuery(
    restaurantId,
    Boolean(restaurantId)
  )
  const selectedCategory = categories?.find((item) => item.id === categoryId)
  const visibleItems = categoryId
    ? data?.filter((item) => item.categoryId === categoryId) ?? []
    : data ?? []
  const canCreateItem = categoryId
    ? selectedCategory?.isActive
    : categories?.some((item) => item.isActive)

  if (isError) {
    return (
      <Alert
        color="coral"
        radius="md"
        title="Не удалось загрузить категории"
        icon={<TbAlertCircle size={18} />}
      >
        {getApiErrorMessage(error)}
      </Alert>
    )
  }

  if (isLoading) {
    return (
      <Flex justify="center">
        <Loader className="mx-auto" />
      </Flex>
    )
  }

  if (!restaurantId || !visibleItems.length) {
    return (
      <Stack gap="lg">
        <Flex justify="space-between" align="center" wrap="wrap" gap="md">
          <div>
            <Text fw={700} className="text-moss-900">
              {selectedCategory ? `Блюда: ${selectedCategory.name}` : 'Блюда'}
            </Text>
            <Text size="sm" className="text-moss-600">
              {selectedCategory
                ? 'Позиции только для выбранной категории.'
                : 'Добавляйте позиции меню и управляйте их состоянием.'}
            </Text>
          </div>

          <Button
            leftSection={<TbPlus size={16} />}
            onClick={() => setIsCreateModalOpen(true)}
            disabled={!canCreateItem}
            color="aurora"
            radius="md"
            h={40}
            className="px-4 font-medium"
          >
            Добавить блюдо
          </Button>
        </Flex>

        {categoryId && data?.length ? (
          <Text size="sm" className="text-moss-600">
            Для выбранной категории пока нет блюд.
          </Text>
        ) : (
          <MenuItemsEmptyPlaceholder />
        )}

        <CreateMenuItemModal
          opened={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          restaurantId={restaurantId}
          categoryId={categoryId || undefined}
          categories={categories}
        />
      </Stack>
    )
  }

  return (
    <Stack>
      <Flex justify="space-between" align="center" wrap="wrap" gap="md">
        <div>
          <Text fw={700} className="text-moss-900">
            {selectedCategory ? `Блюда: ${selectedCategory.name}` : 'Блюда'}
          </Text>
          <Text size="sm" className="text-moss-600">
            {selectedCategory
              ? 'Показаны позиции только выбранной категории.'
              : 'Все блюда выбранного ресторана.'}
          </Text>
        </div>

        <Button
          leftSection={<TbPlus size={16} />}
          onClick={() => setIsCreateModalOpen(true)}
          disabled={!canCreateItem}
          color="aurora"
          radius="md"
          h={40}
          className="px-4 font-medium"
        >
          Добавить блюдо
        </Button>
      </Flex>

      <Stack gap={4} mt={12}>
        <Stack gap="sm">
          {visibleItems.map((item) => {
            return (
              <MenuItemRow
                key={item.id}
                item={item}
                renderActions={(menuItem) => (
                  <MenuItemActions
                    data={menuItem}
                    restaurantId={restaurantId}
                    categories={categories}
                    actionIconProps={{ variant: 'default' }}
                  />
                )}
              />
            )
          })}
        </Stack>
      </Stack>

      <CreateMenuItemModal
        opened={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        restaurantId={restaurantId}
        categoryId={categoryId || undefined}
        categories={categories}
      />
    </Stack>
  )
}
