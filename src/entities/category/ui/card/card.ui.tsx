import { Badge, Card, Group, Stack, Text, Title } from '@mantine/core'
import type { ReactNode } from 'react'
import { TbAlignBoxLeftMiddle, TbArrowsSort, TbNotes } from 'react-icons/tb'
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
      className="bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
    >
      <Group justify="space-between" align="flex-start" gap="lg" wrap="nowrap">
        <Stack gap="md" className="min-w-0 flex-1">
          <Group justify="space-between" align="flex-start" gap="md" wrap="wrap">
            <Group gap="xs" wrap="wrap">
              <Badge color={data.isActive ? 'green' : 'gray'} variant="light" size="lg">
                {data.isActive ? 'Активна' : 'Скрыта'}
              </Badge>

              <Badge variant="dot" color="gray" size="lg" leftSection={<TbArrowsSort size={14} />}>
                Позиция: {data.sortOrder + 1}
              </Badge>
            </Group>

            {renderActions ? <div className="shrink-0">{renderActions(data)}</div> : null}
          </Group>

          <Stack gap={8} className="min-w-0">
            <Group gap="xs" wrap="nowrap">
              <TbAlignBoxLeftMiddle size={18} className="shrink-0 text-aurora-500" />
              <Title order={3} className="truncate text-moss-900">
                {data.name}
              </Title>
            </Group>

            <Group gap="xs" align="flex-start" wrap="nowrap">
              <TbNotes size={16} className="mt-0.5 shrink-0 text-moss-500" />
              <Text size="sm" c="dimmed" className="line-clamp-3">
                {description}
              </Text>
            </Group>
          </Stack>
        </Stack>

        {!renderActions ? (
          <Badge color={data.isActive ? 'green' : 'gray'} variant="light" size="lg">
            {data.isActive ? 'Активна' : 'Скрыта'}
          </Badge>
        ) : null}
      </Group>
    </Card>
  )
}
