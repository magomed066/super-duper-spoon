import { Stack, Text, ThemeIcon, Title } from '@mantine/core'
import { TbInboxOff } from 'react-icons/tb'

export function CategoriesEmptyPlaceholder() {
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
            Список категорий пуст
          </Title>
          <Text className="text-moss-600">
            Когда для ресторана будут созданы категории меню, они появятся здесь.
          </Text>
        </Stack>
      </Stack>
    </div>
  )
}
