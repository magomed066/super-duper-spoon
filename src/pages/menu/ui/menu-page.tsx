import { Flex, Stack, Text } from '@mantine/core'
import { Navigate } from 'react-router'
import {
  AuthPermission,
  getDefaultRouteByRole,
  getRouteFallback,
  hasPermission,
  useAuthStore
} from '@/entities/auth'
import { queryUrlConfig, ROUTES } from '@/shared/config/routes'
import MenuEditorContentWdiget from '@/widgets/menu-editor-content'
import MenuEditorSidebarWidget from '@/widgets/menu-editor-sidebar'
import MenuToolbarWidget from '@/widgets/menu-toolbar'
import PageHeaderWidget from '@/widgets/page-header'
import { useQueryParams } from '@/shared/lib/hooks/use-query-params'
import { MenuEditorEmptyState } from '@/entities/menu'

export function MenuPage() {
  const user = useAuthStore((state) => state.user)
  const canViewMenu = hasPermission(user, AuthPermission.VIEW_MENU)

  const { params } = useQueryParams(queryUrlConfig)

  const { restaurantId } = params

  if (!canViewMenu) {
    return (
      <Navigate
        to={user ? getDefaultRouteByRole(user) : getRouteFallback(ROUTES.MENU)}
        replace
      />
    )
  }

  return (
    <Stack pb={20}>
      <PageHeaderWidget items={[{ label: 'Меню' }]} />

      <Stack className="px-5" gap="lg">
        <Text maw={840} className="text-moss-700">
          Настройте структуру меню ресторана: выберите раздел для редактирования
          и подготовьте наполнение для блюд, добавок и категорий.
        </Text>

        <MenuToolbarWidget />

        {!restaurantId ? (
          <MenuEditorEmptyState />
        ) : (
          <Flex
            direction={{ base: 'column', lg: 'row' }}
            align="stretch"
            gap="lg"
          >
            <MenuEditorSidebarWidget />
            <MenuEditorContentWdiget />
          </Flex>
        )}
      </Stack>
    </Stack>
  )
}
