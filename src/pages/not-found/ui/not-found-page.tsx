import { Button, Card, Group, Stack, Text, ThemeIcon, Title } from '@mantine/core'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/shared/config/routes'

export function NotFoundPage() {
  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(59,132,246,0.18),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(99,181,127,0.16),_transparent_32%)]" />

      <Card
        padding="xl"
        radius="xl"
        className="w-full max-w-lg border border-white/70 bg-white/88 shadow-2xl shadow-aurora-200/40 backdrop-blur"
      >
        <Stack gap="xl">
          <Group justify="space-between" align="flex-start" wrap="nowrap">
            <div>
              <Text className="text-sm font-semibold uppercase tracking-[0.24em] text-(--mantine-color-coral-6)">
                Error 404
              </Text>
              <Title
                order={1}
                className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl"
              >
                Страница не найдена
              </Title>
            </div>

            <ThemeIcon
              size={64}
              radius="xl"
              variant="light"
              color="aurora"
              className="shrink-0"
            >
              <span className="text-2xl font-semibold">?</span>
            </ThemeIcon>
          </Group>

          <Text className="max-w-md text-sm leading-6 text-slate-500 sm:text-base">
            Возможно, адрес введён с ошибкой или страница была перемещена.
            Вернитесь на главный экран и продолжите работу оттуда.
          </Text>

          <Button
            component={Link}
            to={ROUTES.AUTH}
            size="md"
            radius="xl"
            color="coral"
            className="self-start px-6"
          >
            На главную
          </Button>
        </Stack>
      </Card>
    </main>
  )
}
