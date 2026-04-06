import { useDeleteRestaurantMutation, useRestaurantStatusMutation } from '@/entities/restaurant'
import { useAuthStore } from '@/entities/auth'
import { UserRole } from '@/shared/api/services/auth/types'
import type { Restaurant } from '@/shared/api/services/restaurant/types'
import { useState } from 'react'

type ConfirmAction = 'activate' | 'deactivate' | 'delete'

function useRestaurantActions(data: Restaurant) {
  const user = useAuthStore((state) => state.user)
  const statusMutation = useRestaurantStatusMutation()
  const deleteMutation = useDeleteRestaurantMutation()
  const [pendingAction, setPendingAction] = useState<ConfirmAction | null>(null)

  const canDeleteRestaurant = user?.role === UserRole.CLIENT
  const isActionPending = statusMutation.isPending || deleteMutation.isPending

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

  const openDeleteConfirm = () => {
    if (isActionPending || !canDeleteRestaurant) {
      return
    }

    setPendingAction('delete')
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

    if (pendingAction === 'delete') {
      deleteMutation.mutate(data.id, {
        onSuccess: () => setPendingAction(null)
      })
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
      label: 'Отключить',
      color: 'red',
      disabled: !data.isActive || isActionPending,
      onClick: openDeactivateConfirm
    },
    ...(canDeleteRestaurant
      ? [
          {
            key: 'delete',
            label: 'Удалить',
            color: 'red' as const,
            disabled: isActionPending,
            onClick: openDeleteConfirm
          }
        ]
      : [])
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
          title: 'Отключить ресторан?',
          description: `Ресторан «${data.name}» будет отключен.`,
          confirmLabel: 'Отключить',
          confirmColor: 'coral' as const
        }
      : pendingAction === 'delete'
      ? {
          opened: true,
          title: 'Удалить ресторан?',
          description: `Ресторан «${data.name}» будет удален без возможности восстановления.`,
          confirmLabel: 'Удалить',
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
