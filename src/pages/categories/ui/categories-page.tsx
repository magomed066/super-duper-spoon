import {
  AuthPermission,
  getDefaultRouteByRole,
  getRouteFallback,
  hasPermission,
  useAuthStore
} from '@/entities/auth'
import { useRestaurantsListQuery } from '@/entities/restaurant'
import { getApiErrorMessage } from '@/shared/api/errors'
import { ROUTES } from '@/shared/config/routes'
import { ErrorBoundary } from '@/shared/ui/error-boundary'
import CreateCategoryModal from '@/features/category/create-category-modal'
import CategoriesListWidget from '@/widgets/categories-list'
import PageHeaderWidget from '@/widgets/page-header'
import { Alert, Button, Divider, Loader, Select, Stack, Text } from '@mantine/core'
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router'
import { TbAlertCircle } from 'react-icons/tb'

export function CategoriesPage() {
  const user = useAuthStore((state) => state.user)
  const canViewMenu = hasPermission(user, AuthPermission.VIEW_MENU)
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(
    null
  )
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const { data, error, isError, isLoading } = useRestaurantsListQuery(canViewMenu)

  const restaurants = data?.pages.flatMap((page) => page.items) ?? []
  const restaurantOptions = restaurants.map((restaurant) => ({
    value: restaurant.id,
    label: restaurant.name
  }))

  useEffect(() => {
    if (selectedRestaurantId || !restaurants.length) {
      return
    }

    setSelectedRestaurantId(restaurants[0]?.id ?? null)
  }, [restaurants, selectedRestaurantId])

  if (!canViewMenu) {
    return (
      <Navigate
        to={
          user ? getDefaultRouteByRole(user) : getRouteFallback(ROUTES.CATEGORIES)
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

        {isError ? (
          <Alert
            color="coral"
            radius="md"
            title="Не удалось загрузить список ресторанов"
            icon={<TbAlertCircle size={18} />}
          >
            {getApiErrorMessage(error)}
          </Alert>
        ) : null}

        {isLoading ? <Loader className="mx-auto" /> : null}

        {!isLoading && !isError ? (
          <Stack gap="lg">
            <Stack gap="sm">
              <Select
                label="Ресторан"
                placeholder="Выберите ресторан"
                data={restaurantOptions}
                value={selectedRestaurantId}
                onChange={setSelectedRestaurantId}
                searchable
                nothingFoundMessage="Рестораны не найдены"
                className="max-w-xl"
              />

              <Button
                className="self-start"
                onClick={() => setIsCreateModalOpen(true)}
                disabled={!selectedRestaurantId}
              >
                Создать категорию
              </Button>
            </Stack>

            {!restaurants.length ? (
              <Alert
                color="blue"
                radius="md"
                title="Нет доступных ресторанов"
                icon={<TbAlertCircle size={18} />}
              >
                Как только у вас появится доступ к ресторану, здесь можно будет
                просматривать его категории.
              </Alert>
            ) : selectedRestaurantId ? (
              <ErrorBoundary
                title="Не удалось отобразить категории"
                message="Во время отображения категорий произошла ошибка. Попробуйте перезагрузить блок."
              >
                <CategoriesListWidget restaurantId={selectedRestaurantId} />
              </ErrorBoundary>
            ) : null}

            {selectedRestaurantId ? (
              <CreateCategoryModal
                opened={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                restaurantId={selectedRestaurantId}
              />
            ) : null}
          </Stack>
        ) : null}
      </Stack>
    </Stack>
  )
}
