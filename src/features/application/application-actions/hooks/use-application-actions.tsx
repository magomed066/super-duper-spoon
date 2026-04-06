import {
  useApproveApplicationMutation,
  useRejectApplicationMutation
} from '@/entities/application'
import { AuthPermission, hasPermission, useAuthStore } from '@/entities/auth'
import {
  ApplicationStatus,
  type RequestClient
} from '@/shared/api/services/application/types'
import { useState } from 'react'

type ConfirmAction = 'approve' | 'reject'

function useApplicationActions(data: RequestClient) {
  const user = useAuthStore((state) => state.user)
  const canManageApplications = hasPermission(
    user,
    AuthPermission.MANAGE_APPLICATIONS
  )

  const approveMutation = useApproveApplicationMutation()
  const rejectMutation = useRejectApplicationMutation()

  const isPending = data.status === ApplicationStatus.PENDING
  const isActionPending = approveMutation.isPending || rejectMutation.isPending
  const [pendingAction, setPendingAction] = useState<ConfirmAction | null>(null)

  const handleApprove = () => {
    if (!canManageApplications) {
      return
    }

    setPendingAction('approve')
  }

  const handleReject = () => {
    if (!canManageApplications) {
      return
    }

    setPendingAction('reject')
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

    if (pendingAction === 'approve') {
      approveMutation.mutate(data.id, {
        onSuccess: () => setPendingAction(null)
      })

      return
    }

    rejectMutation.mutate(data.id, {
      onSuccess: () => setPendingAction(null)
    })
  }

  const menuActions = [
    {
      key: 'approve',
      label: 'Подтвердить',
      disabled: !canManageApplications || !isPending || isActionPending,
      onClick: handleApprove
    },
    {
      key: 'reject',
      label: 'Отказать',
      color: 'red',
      disabled: !canManageApplications || !isPending || isActionPending,
      onClick: handleReject
    }
  ]

  const confirmModalProps =
    pendingAction === 'approve'
      ? {
          opened: true,
          title: 'Подтвердить заявку?',
          description: `Для ресторана «${data.restaurantName}» будет одобрена заявка и создан аккаунт клиента.`,
          confirmLabel: 'Подтвердить',
          confirmColor: 'aurora' as const
        }
      : pendingAction === 'reject'
      ? {
          opened: true,
          title: 'Отклонить заявку?',
          description: `Заявка ресторана «${data.restaurantName}» будет отклонена.`,
          confirmLabel: 'Отклонить',
          confirmColor: 'coral' as const
        }
      : {
          opened: false,
          title: '',
          description: '',
          confirmLabel: 'Подтвердить',
          confirmColor: 'aurora' as const
        }

  return {
    menuActions,
    canManageApplications,
    confirmModalProps,
    closeConfirmModal,
    handleConfirm,
    isActionPending
  }
}

export default useApplicationActions
