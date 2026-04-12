import type { MenuItem } from '@/shared/api/services/menu-item/types'
import ConfirmModal from '@/shared/ui/confirm-modal'
import MenuActions from '@/shared/ui/menu'
import type { ActionIconProps, MenuProps } from '@mantine/core'
import type { ReactNode } from 'react'

type Props = {
  data: MenuItem
  trigger?: ReactNode
  menuProps?: Omit<MenuProps, 'children'>
  actionIconProps?: ActionIconProps
}

export function MenuItemActions(props: Props) {
  const { data, trigger, menuProps, actionIconProps } = props

  const menuActions = [
    {
      key: 'edit',
      label: 'Редактировать',
      disabled: false,
      hidden: false,
      onClick: () => {}
    }
  ]

  const confirmModalProps = {
    opened: false,
    title: 'Редактировать блюдо?',
    description: `Блюдо «${data.name}» будет изменено.`,
    confirmLabel: 'Сохранить',
    confirmColor: 'coral' as const
  }

  return (
    <>
      <MenuActions
        items={menuActions}
        trigger={trigger}
        menuProps={menuProps}
        actionIconProps={{
          variant: 'default',
          className: 'bg-black/35 hover:bg-black/45',
          ...actionIconProps
        }}
      />
      <ConfirmModal
        {...confirmModalProps}
        cancelLabel="Отменить"
        loading={false}
        onClose={() => {}}
        onConfirm={() => {}}
      />
    </>
  )
}
