import type { Restaurant } from '@/shared/api/services/restaurant/types'
import ConfirmModal from '@/shared/ui/confirm-modal'
import MenuActions from '@/shared/ui/menu'
import useRestaurantActions from '../hooks/use-restaurant-actions'
import { useAuthStore } from '@/entities/auth'
import { UserRole } from '@/shared/api/services/auth/types'

type Props = {
  data: Restaurant
}

export function RestaurantActions({ data }: Props) {
  const {
    menuActions,
    confirmModalProps,
    closeConfirmModal,
    handleConfirm,
    isActionPending
  } = useRestaurantActions(data)

  const { user } = useAuthStore()
  const isClient = user?.role === UserRole.CLIENT

  if (isClient && data.status === 'PENDING_APPROVAL') {
    return null
  }

  {
    return (
      <>
        <MenuActions
          items={menuActions}
          actionIconProps={{
            variant: 'default',
            className: 'bg-black/35 hover:bg-black/45'
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
}
