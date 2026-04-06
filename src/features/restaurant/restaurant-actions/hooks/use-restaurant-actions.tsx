import { useRestaurantStatusMutation } from '@/entities/restaurant'
import type { Restaurant } from '@/shared/api/services/restaurant/types'
import { useState } from 'react'

type ConfirmAction = 'activate' | 'deactivate'

function useRestaurantActions(data: Restaurant) {
  const statusMutation = useRestaurantStatusMutation()
  const [pendingAction, setPendingAction] = useState<ConfirmAction | null>(null)

  const isActionPending = statusMutation.isPending

  const openActivateConfirm = () => {
    if (isActionPending || data.isActive) {
      return
    }

    setPendingAction('activate')
  }

  const openDeactivateConfirm = () => {
    if (isActionPending || !data.isActive) {
      return
    }

    setPendingAction('deactivate')
  }

  const closeConfirmModal = () => {
    if (isActionPending) {
      return
    }

    setPendingAction(null)
  }

  const handleConfirm = () => {
    if (!pendingAction) {
      return
    }

    statusMutation.mutate(
      {
        id: data.id,
        isActive: pendingAction === 'activate'
      },
      {
        onSuccess: () => setPendingAction(null)
      }
    )
  }

  const menuActions = [
    {
      key: 'activate',
      label: 'Активировать',
      disabled: data.isActive || isActionPending,
      onClick: openActivateConfirm
    },
    {
      key: 'deactivate',
      label: 'Деактивировать',
      color: 'red',
      disabled: !data.isActive || isActionPending,
      onClick: openDeactivateConfirm
    }
  ]

  const confirmModalProps =
    pendingAction === 'activate'
      ? {
          opened: true,
          title: 'Активировать ресторан?',
          description: `Ресторан «${data.name}» станет активным и будет доступен для работы.`,
          confirmLabel: 'Активировать',
          confirmColor: 'aurora' as const
        }
      : pendingAction === 'deactivate'
      ? {
          opened: true,
          title: 'Деактивировать ресторан?',
          description: `Ресторан «${data.name}» будет деактивирован.`,
          confirmLabel: 'Деактивировать',
          confirmColor: 'coral' as const
        }
      : {
          opened: false,
          title: '',
          description: '',
          confirmLabel: 'Подтвердить',
          confirmColor: 'green' as const
        }

  return {
    menuActions,
    confirmModalProps,
    closeConfirmModal,
    handleConfirm,
    isActionPending
  }
}

export default useRestaurantActions
