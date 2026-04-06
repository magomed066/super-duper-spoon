import { Group, Stack, Text, ThemeIcon } from '@mantine/core'
import type { ReactNode } from 'react'

type Props = {
  icon: ReactNode
  label: string
  value: string
}

export function RestaurantInfoRow({ icon, label, value }: Props) {
  return (
    <Group align="flex-start" gap="sm" wrap="nowrap">
      <ThemeIcon
        size={34}
        radius="md"
        variant="light"
        color="gray"
        className="shrink-0"
      >
        {icon}
      </ThemeIcon>
      <Stack gap={2}>
        <Text size="xs" fw={600} c="dimmed" tt="uppercase">
          {label}
        </Text>
        <Text size="sm" className="wrap-break-word">
          {value}
        </Text>
      </Stack>
    </Group>
  )
}
