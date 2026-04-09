import type { Restaurant } from '@/shared/api/services/restaurant/types'
import ConfirmModal from '@/shared/ui/confirm-modal'
import MenuActions from '@/shared/ui/menu'
import type { MenuActionItem } from '@/shared/ui/menu'
import useRestaurantActions from '../hooks/use-restaurant-actions'
import { useAuthStore } from '@/entities/auth'
import { UserRole } from '@/shared/api/services/auth/types'
import { RestaurantModerationStatus } from '@/shared/api/services/restaurant/types'
import type { ActionIconProps, MenuProps } from '@mantine/core'
import type { ReactNode } from 'react'

type Props = {
  data: Restaurant
  trigger?: ReactNode
  menuProps?: Omit<MenuProps, 'children'>
  actionIconProps?: ActionIconProps
}

export function RestaurantActions({
  data,
  trigger,
  menuProps,
  actionIconProps
}: Props) {
  const {
    menuActions,
    confirmModalProps,
    closeConfirmModal,
    handleConfirm,
    isActionPending
  } = useRestaurantActions(data)

  const { user } = useAuthStore()
  const isClient = user?.role === UserRole.CLIENT

  if (isClient && data.status === RestaurantModerationStatus.PENDING_APPROVAL) {
    return null
  }

  const visibleActions = menuActions.filter(
    (item: MenuActionItem) => !item.hidden
  )

  if (!visibleActions.length) {
    return null
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
        cancelLabel="Назад"
        loading={isActionPending}
        onClose={closeConfirmModal}
        onConfirm={handleConfirm}
      />
    </>
  )
}
