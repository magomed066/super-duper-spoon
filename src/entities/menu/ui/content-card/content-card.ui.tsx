import { Paper, Stack, Text, Title } from '@mantine/core'

type MenuContentCardProps = {
  eyebrow?: string
  title: string
  description: string
}

export function MenuContentCard({
  eyebrow,
  title,
  description
}: MenuContentCardProps) {
  return (
    <Paper withBorder radius="xl" p="xl" className="bg-[#faf7f2]">
      <Stack gap={10}>
        {eyebrow ? (
          <Text size="xs" fw={700} tt="uppercase" className="text-moss-600">
            {eyebrow}
          </Text>
        ) : null}
        <Title order={4} className="text-moss-900">
          {title}
        </Title>
        <Text className="text-moss-700">{description}</Text>
      </Stack>
    </Paper>
  )
}
