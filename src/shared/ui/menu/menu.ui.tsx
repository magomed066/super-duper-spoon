import {
  ActionIcon,
  Menu as MantineMenu,
  type MenuItemProps
} from '@mantine/core'
import type { ComponentProps, ReactNode } from 'react'
import { TbDots } from 'react-icons/tb'

type MantineMenuProps = ComponentProps<typeof MantineMenu>

export type MenuActionItem = {
  key: string
  label: ReactNode
  onClick?: () => void
  leftSection?: ReactNode
  rightSection?: ReactNode
  color?: MenuItemProps['color']
  disabled?: boolean
  hidden?: boolean
  closeMenuOnClick?: boolean
}

type MenuActionsProps = {
  items: MenuActionItem[]
  trigger?: ReactNode
  menuProps?: Omit<MantineMenuProps, 'children'>
  actionIconProps?: ComponentProps<typeof ActionIcon>
}

export function MenuActions({
  items,
  trigger,
  menuProps,
  actionIconProps
}: MenuActionsProps) {
  const visibleItems = items.filter((item) => !item.hidden)

  return (
    <MantineMenu withinPortal position="bottom-end" shadow="sm" {...menuProps}>
      <MantineMenu.Target>
        {trigger ?? (
          <ActionIcon
            variant="subtle"
            color="gray"
            radius="xl"
            {...actionIconProps}
          >
            <TbDots size={16} />
          </ActionIcon>
        )}
      </MantineMenu.Target>

      <MantineMenu.Dropdown>
        {visibleItems.map((item) => (
          <MantineMenu.Item
            key={item.key}
            color={item.color}
            disabled={item.disabled}
            leftSection={item.leftSection}
            rightSection={item.rightSection}
            closeMenuOnClick={item.closeMenuOnClick}
            onClick={item.onClick}
          >
            {item.label}
          </MantineMenu.Item>
        ))}
      </MantineMenu.Dropdown>
    </MantineMenu>
  )
}
