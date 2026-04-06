import { ErrorBoundary } from '@/shared/ui/error-boundary'
import PageHeaderWidget from '@/widgets/page-header'
import RestaurantsListWidget from '@/widgets/restaurants-list'
import { Divider, Stack, Text } from '@mantine/core'

export function RestaurantPage() {
  return (
    <Stack pb={20}>
      <PageHeaderWidget title="Список ресторанов" />

      <Stack className="mt-3 px-5 flex flex-col gap">
        <Text maw={640} className="text-moss-700">
          Здесь отображаются все ваши рестораны на подключение ресторанов с
          текущими статусами и контактами заявителей.
        </Text>

        <Divider my={3} />

        <ErrorBoundary
          title="Не удалось отобразить список ресторанов"
          message="Во время отображения списка произошла ошибка. Попробуйте перезагрузить блок."
        >
          <RestaurantsListWidget />
        </ErrorBoundary>
      </Stack>
    </Stack>
  )
}
