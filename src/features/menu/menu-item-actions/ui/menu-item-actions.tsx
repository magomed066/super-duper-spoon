import type { Category } from '@/entities/category'
import { useDeleteMenuItemMutation, useUpdateMenuItemMutation } from '@/entities/menu'
import CreateMenuItemModal from '@/features/menu/create-menu-item-modal'
import type { MenuItem } from '@/shared/api/services/menu-item/types'
import ConfirmModal from '@/shared/ui/confirm-modal'
import MenuActions from '@/shared/ui/menu'
import { useState } from 'react'
import type { ActionIconProps, MenuProps } from '@mantine/core'
import type { ReactNode } from 'react'

type Props = {
  data: MenuItem
  restaurantId: string
  categories?: Category[]
  trigger?: ReactNode
  menuProps?: Omit<MenuProps, 'children'>
  actionIconProps?: ActionIconProps
}

export function MenuItemActions(props: Props) {
  const { data, restaurantId, categories, trigger, menuProps, actionIconProps } = props
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const updateMutation = useUpdateMenuItemMutation(restaurantId)
  const deleteMutation = useDeleteMenuItemMutation(restaurantId, () =>
    setIsDeleteOpen(false)
  )
  const isActionPending = updateMutation.isPending || deleteMutation.isPending

  const menuActions = [
    {
      key: 'edit',
      label: 'Редактировать',
      disabled: isActionPending,
      onClick: () => setIsEditOpen(true)
    },
    {
      key: 'toggle-active',
      label: data.isActive ? 'Сделать неактивным' : 'Сделать активным',
      disabled: isActionPending,
      onClick: () =>
        updateMutation.mutate({
          itemId: data.id,
          payload: {
            isActive: !data.isActive
          }
        })
    },
    {
      key: 'delete',
      label: 'Удалить',
      color: 'red' as const,
      disabled: isActionPending,
      onClick: () => setIsDeleteOpen(true)
    }
  ]

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

      <CreateMenuItemModal
        opened={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        restaurantId={restaurantId}
        categories={categories}
        menuItem={data}
      />

      <ConfirmModal
        opened={isDeleteOpen}
        title="Удалить блюдо?"
        description={`Блюдо «${data.name}» будет удалено без возможности восстановления.`}
        confirmLabel="Удалить"
        confirmColor="red"
        cancelLabel="Отменить"
        loading={isActionPending}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => deleteMutation.mutate(data.id)}
      />
    </>
  )
}
