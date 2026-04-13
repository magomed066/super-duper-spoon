import clsx from 'classnames'
import { Badge, Flex, Text } from '@mantine/core'
import type { ReactNode } from 'react'
import { TbGripVertical } from 'react-icons/tb'
import type { Category } from '../../model/types'

type Props = {
  data: Category
  renderActions?: (item: Category) => ReactNode
}

export function CategoryCard({ data, renderActions }: Props) {
  const description = data.description?.trim() || 'Описание отсутствует'

  return (
    <Flex
      align="center"
      w="100%"
      p={12}
      gap={12}
      className="relative border rounded-lg border-moss-200"
    >
      <Flex
        w={24}
        h={56}
        align="center"
        justify="center"
        className={clsx(
          'shrink-0 text-moss-400',
          data.isActive ? 'opacity-100' : 'opacity-50'
        )}
      >
        <TbGripVertical size={20} />
      </Flex>

      <Flex direction="column" className="min-w-0 flex-1">
        <Text
          size="md"
          fw={500}
          className={data.isActive ? 'text-moss-900' : 'text-moss-500'}
        >
          {data.name}
        </Text>

        <Text size="sm" className="line-clamp-2 text-moss-600">
          {description}
        </Text>
      </Flex>

      <Flex direction="column" align="flex-end" gap={8} className="shrink-0">
        <Badge color={data.isActive ? 'green' : 'gray'} variant="light">
          {data.isActive ? 'Активна' : 'Скрыта'}
        </Badge>

        {renderActions ? <div>{renderActions(data)}</div> : null}
      </Flex>
    </Flex>
  )
}
