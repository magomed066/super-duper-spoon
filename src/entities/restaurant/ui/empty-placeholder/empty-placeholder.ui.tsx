import { Stack, Text, ThemeIcon, Title } from '@mantine/core'
import { TbInboxOff } from 'react-icons/tb'

export function RestaurantsEmptyPlaceholder() {
  return (
    <div className="bg-white rounded-md p-xl flex min-h-72 items-center justify-center">
      <Stack align="center" gap="md" className="max-w-md w-full text-center">
        <ThemeIcon
          size={64}
          radius="xl"
          color="aurora"
          variant="light"
          className="shadow-sm"
        >
          <TbInboxOff size={32} />
        </ThemeIcon>

        <Stack gap={6}>
          <Title order={4} className="text-moss-900">
            Список ресторанов пуст
          </Title>
          <Text className="text-moss-600">
            Когда рестораны появятся в системе, они отобразятся здесь.
          </Text>
        </Stack>
      </Stack>
    </div>
  )
}
