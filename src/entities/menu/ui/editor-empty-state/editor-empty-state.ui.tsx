import { Flex, Stack, Text, ThemeIcon, Title } from '@mantine/core'
import { TbLayoutSidebarLeftExpand } from 'react-icons/tb'

export function MenuEditorEmptyState() {
  return (
    <Flex h="100%" align="center" justify="center">
      <Stack align="center" gap="md" maw={520} ta="center">
        <ThemeIcon size={64} radius="xl" variant="light" color="gray">
          <TbLayoutSidebarLeftExpand size={30} />
        </ThemeIcon>
        <Stack gap={6}>
          <Title order={3} className="text-moss-900">
            Выберите ресторан
          </Title>
          <Text className="text-moss-600">
            После выбора ресторана слева появятся его активные категории, а здесь
            можно будет перейти к настройке структуры меню.
          </Text>
        </Stack>
      </Stack>
    </Flex>
  )
}
