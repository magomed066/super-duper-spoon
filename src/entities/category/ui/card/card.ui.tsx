import { Badge, Card, Group, Stack, Text, Title } from '@mantine/core'
import type { ReactNode } from 'react'
import { TbAlignBoxLeftMiddle } from 'react-icons/tb'
import type { Category } from '../../model/types'

type Props = {
  data: Category
  renderActions?: (item: Category) => ReactNode
}

export function CategoryCard({ data, renderActions }: Props) {
  const description = data.description?.trim() || 'Описание категории пока не заполнено'

  return (
    <Card
      withBorder
      radius="lg"
      padding="lg"
      className="h-full bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
    >
      <Stack gap="md" className="h-full">
        <Group justify="space-between" align="flex-start" gap="md">
          <Group gap="xs" wrap="wrap">
            <Badge color={data.isActive ? 'green' : 'gray'} variant="light" size="lg">
              {data.isActive ? 'Активна' : 'Скрыта'}
            </Badge>
          </Group>

          {renderActions ? <div className="shrink-0">{renderActions(data)}</div> : null}
        </Group>

        <Stack gap={6} className="min-w-0">
          <Group gap="xs" wrap="nowrap">
            <TbAlignBoxLeftMiddle size={18} className="shrink-0 text-aurora-500" />
            <Title order={3} className="truncate text-moss-900">
              {data.name}
            </Title>
          </Group>
        </Stack>

        <Text size="sm" c="dimmed" className="line-clamp-4">
          {description}
        </Text>
      </Stack>
    </Card>
  )
}
