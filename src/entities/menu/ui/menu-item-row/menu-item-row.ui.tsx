import clsx from 'classnames'
import { Avatar, Flex, Text, Title } from '@mantine/core'
import type { MenuItem } from '@/shared/api/services/menu-item/types'
import { resolveMediaUrl } from '@/shared/lib/helpers/media'
import { TbPhoto } from 'react-icons/tb'
import { priceFormatter } from '@/shared/lib/helpers/price-formatter'
import type { ReactNode } from 'react'
import cn from 'classnames'

type MenuItemRowProps = {
  item: MenuItem
  categoryLabel?: string
  disabled?: boolean
  onToggleActive?: (nextValue: boolean) => void
  renderActions?: (data: MenuItem) => ReactNode
}

export function MenuItemRow({
  item,
  categoryLabel,
  renderActions
}: MenuItemRowProps) {
  return (
    <Flex
      align="center"
      w="100%"
      py={12}
      gap={12}
      className="relative border-b border-t border-moss-200"
    >
      {item.image ? (
        <Avatar
          w={56}
          h={56}
          radius={8}
          src={resolveMediaUrl(item.image)}
          opacity={item.isActive ? 1 : 0.4}
          alt={item.name}
        />
      ) : (
        <Flex
          w={56}
          h={56}
          align="center"
          justify="center"
          className={clsx(
            'rounded-lg bg-[#f5f1e8] text-moss-500',
            !item.isActive && 'opacity-40'
          )}
        >
          <TbPhoto size={24} />
        </Flex>
      )}

      <Flex direction="column" className="min-w-0 flex-1">
        <Text
          size="md"
          fw={500}
          className={item.isActive ? 'text-moss-900' : 'text-moss-500'}
        >
          {item.name}
        </Text>

        {categoryLabel ? (
          <Text size="sm" className="text-moss-500">
            {categoryLabel}
          </Text>
        ) : null}

        <Text size="sm" className="line-clamp-2 text-moss-600">
          {item.description?.trim() || 'Описание пока не заполнено.'}
        </Text>
      </Flex>

      <Flex direction="column" align="flex-end" className="shrink-0">
        <Title
          order={4}
          fw={600}
          className={cn(item.isActive ? 'text-moss-900' : 'text-moss-500')}
        >
          {priceFormatter.format(item.price)}
        </Title>
      </Flex>

      {renderActions?.(item)}
    </Flex>
  )
}
