import { Button, Card, Group, Stack, Text, Title } from '@mantine/core'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/shared/config/routes'

export function UnauthorizedPage() {
  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-moss-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10" />

      <Card
        padding="xl"
        radius="xl"
        className="w-full max-w-lg border border-moss-200 bg-white/92 shadow-2xl shadow-aurora-100/20 backdrop-blur"
      >
        <Stack gap="xl">
          <Group justify="space-between" align="flex-start" wrap="nowrap">
            <div>
              <Text className="text-sm font-semibold uppercase tracking-[0.24em] text-(--mantine-color-coral-6)">
                Error 401
              </Text>
              <Title
                order={1}
                className="mt-3 text-4xl font-semibold tracking-tight text-moss-900 sm:text-5xl"
              >
                Требуется авторизация
              </Title>
            </div>
          </Group>

          <Text className="max-w-md text-sm leading-6 text-moss-700 sm:text-base">
            Ваша сессия недоступна или истекла. Войдите заново, чтобы продолжить
            работу с защищёнными разделами.
          </Text>

          <Button
            component={Link}
            to={ROUTES.AUTH}
            size="md"
            radius="xl"
            color="coral"
            className="self-start px-6"
          >
            Перейти ко входу
          </Button>
        </Stack>
      </Card>
    </main>
  )
}
