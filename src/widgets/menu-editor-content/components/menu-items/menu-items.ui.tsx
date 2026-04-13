import { useState } from 'react'
import { useCategoriesQuery } from '@/entities/category'
import { MenuItemRow, MenuItemsEmptyPlaceholder } from '@/entities/menu'
import { useMenuItemsQuery } from '@/entities/menu/model/hooks'
import CreateMenuItemModal from '@/features/menu/create-menu-item-modal'
import { MenuItemActions } from '@/features/menu/menu-item-actions/ui/menu-item-actions'
import { getApiErrorMessage } from '@/shared/api/errors'
import { queryUrlConfig } from '@/shared/config/routes'
import { useQueryParams } from '@/shared/lib/hooks/use-query-params'
import { Alert, Button, Flex, Loader, Stack, Text } from '@mantine/core'
import { TbAlertCircle, TbPlus } from 'react-icons/tb'

export function MenuItemsWidget() {
  const { params } = useQueryParams(queryUrlConfig)
  const { restaurantId } = params
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const { data, isError, error, isLoading } = useMenuItemsQuery(
    restaurantId,
    Boolean(restaurantId)
  )
  const { data: categories } = useCategoriesQuery(
    restaurantId,
    Boolean(restaurantId)
  )

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

  if (!restaurantId || !data?.length) {
    return (
      <Stack gap="lg">
        <Flex justify="space-between" align="center" wrap="wrap" gap="md">
          <div>
            <Text fw={700} className="text-moss-900">
              Блюда
            </Text>
            <Text size="sm" className="text-moss-600">
              Добавляйте позиции меню и управляйте их состоянием.
            </Text>
          </div>

          <Button
            leftSection={<TbPlus size={16} />}
            onClick={() => setIsCreateModalOpen(true)}
            disabled={!categories?.some((item) => item.isActive)}
            color="aurora"
            radius="md"
            h={40}
            className="px-4 font-medium"
          >
            Добавить блюдо
          </Button>
        </Flex>

        <MenuItemsEmptyPlaceholder />

        <CreateMenuItemModal
          opened={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          restaurantId={restaurantId}
          categories={categories}
        />
      </Stack>
    )
  }

  return (
    <Stack>
      {/* <Flex justify="space-between" align="center" wrap="wrap" gap="md"> */}
      <Button
        leftSection={<TbPlus size={16} />}
        onClick={() => setIsCreateModalOpen(true)}
        disabled={!categories?.some((item) => item.isActive)}
        color="aurora"
        radius="md"
        h={40}
        className="px-4 font-medium ml-auto"
      >
        Добавить блюдо
      </Button>
      {/* </Flex> */}

      <Stack gap={4} mt={12}>
        <Stack gap="sm">
          {data.map((item) => {
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
        categories={categories}
      />
    </Stack>
  )
}
