import { ActionIcon, Group, Text } from '@mantine/core'
import type { ReactNode } from 'react'

type Props = {
  icon: ReactNode
  label: string
  value: string
}

export function InfoRow(data: Props) {
  const { icon, label, value } = data

  return (
    <Group align="flex-start" gap="sm" wrap="nowrap">
      <ActionIcon
        aria-hidden
        variant="light"
        color="gray"
        radius="xl"
        size="lg"
        className="shrink-0 hover:cursor-none"
      >
        {icon}
      </ActionIcon>

      <div className="min-w-0">
        <Text c="dimmed" fz="xs" fw={500}>
          {label}
        </Text>
        <Text fz="sm" fw={500} className="wrap-break-word">
          {value}
        </Text>
      </div>
    </Group>
  )
}
