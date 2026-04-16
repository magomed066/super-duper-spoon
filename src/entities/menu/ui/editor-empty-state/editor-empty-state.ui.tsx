import { Flex, Paper, Stack, ThemeIcon, Title } from '@mantine/core'
import { TbDatabaseOff } from 'react-icons/tb'

export function MenuEditorEmptyState() {
  return (
    <Paper p={40}>
      <Flex h="100%" align="center" justify="center">
        <Stack align="center" gap="md" maw={520} ta="center">
          <ThemeIcon size={64} radius="xl" variant="light" color="gray">
            <TbDatabaseOff size={30} />
          </ThemeIcon>
          <Stack gap={6}>
            <Title order={3} className="text-moss-900">
              Выберите ресторан
            </Title>
          </Stack>
        </Stack>
      </Flex>
    </Paper>
  )
}
