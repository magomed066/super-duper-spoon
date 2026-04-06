import type { Restaurant } from '@/shared/api/services/restaurant/types'
import ConfirmModal from '@/shared/ui/confirm-modal'
import MenuActions from '@/shared/ui/menu'
import useRestaurantActions from '../hooks/use-restaurant-actions'

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

  return (
    <>
      <MenuActions
        items={menuActions}
        actionIconProps={{
          color: 'dark',
          variant: 'filled',
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
