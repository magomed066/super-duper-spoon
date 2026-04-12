import { MenuItemRow, MenuItemsEmptyPlaceholder } from '@/entities/menu'
import { useMenuItemsQuery } from '@/entities/menu/model/hooks'
import { MenuItemActions } from '@/features/menu/menu-item-actions/ui/menu-item-actions'
import { getApiErrorMessage } from '@/shared/api/errors'
import { queryUrlConfig } from '@/shared/config/routes'
import { useQueryParams } from '@/shared/lib/hooks/use-query-params'
import { Alert, Flex, Loader, Stack } from '@mantine/core'
import { TbAlertCircle } from 'react-icons/tb'

export function MenuItemsWidget() {
  const { params } = useQueryParams(queryUrlConfig)
  const { restaurantId } = params

  const { data, isError, error, isLoading } = useMenuItemsQuery(
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
    return <MenuItemsEmptyPlaceholder />
  }

  return (
    <Stack>
      <Stack gap={4}>
        <Stack gap="sm">
          {data.map((item) => {
            return (
              <MenuItemRow
                key={item.id}
                item={item}
                renderActions={(menuItem) => (
                  <MenuItemActions
                    data={menuItem}
                    actionIconProps={{ variant: 'default' }}
                  />
                )}
              />
            )
          })}
        </Stack>
      </Stack>
    </Stack>
  )
}
