import {
  AuthPermission,
  getDefaultRouteByRole,
  getRouteFallback,
  hasPermission,
  useAuthStore
} from '@/entities/auth'
import { CategoryManagement } from '@/features/category/category-management'
import { ROUTES } from '@/shared/config/routes'
import { ErrorBoundary } from '@/shared/ui/error-boundary'
import CategoriesListWidget from '@/widgets/categories-list'
import PageHeaderWidget from '@/widgets/page-header'
import { Divider, Stack, Text } from '@mantine/core'
import { Navigate } from 'react-router'

export function CategoriesPage() {
  const user = useAuthStore((state) => state.user)
  const canViewMenu = hasPermission(user, AuthPermission.VIEW_MENU)

  if (!canViewMenu) {
    return (
      <Navigate
        to={
          user
            ? getDefaultRouteByRole(user)
            : getRouteFallback(ROUTES.CATEGORIES)
        }
        replace
      />
    )
  }

  return (
    <Stack pb={20}>
      <PageHeaderWidget items={[{ label: 'Категории' }]} />

      <Stack className="px-5">
        <Text maw={720} className="text-moss-700">
          Здесь отображаются категории выбранного ресторана. Переключайте
          ресторан, чтобы просматривать и дальше управлять его меню.
        </Text>

        <Divider my={3} />

        <CategoryManagement />

        <ErrorBoundary
          title="Не удалось отобразить список категорий"
          message="Во время отображения категорий произошла ошибка. Попробуйте перезагрузить блок."
        >
          <CategoriesListWidget />
        </ErrorBoundary>
      </Stack>
    </Stack>
  )
}
