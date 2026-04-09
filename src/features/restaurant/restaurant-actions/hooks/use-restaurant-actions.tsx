import {
  useApproveRestaurantMutation,
  useArchiveRestaurantMutation,
  useBlockRestaurantMutation,
  useDeleteRestaurantMutation,
  useRejectRestaurantMutation,
  useRequestRestaurantChangesMutation,
  useSubmitRestaurantForApprovalMutation
} from '@/entities/restaurant'
import { useAuthStore } from '@/entities/auth'
import { UserRole } from '@/shared/api/services/auth/types'
import { getRestaurantEditRoute } from '@/shared/config/routes'
import type { Restaurant } from '@/shared/api/services/restaurant/types'
import { useState } from 'react'
import { useNavigate } from 'react-router'

type ConfirmAction =
  | 'submitForApproval'
  | 'approve'
  | 'requestChanges'
  | 'reject'
  | 'block'
  | 'archive'
  | 'delete'

function useRestaurantActions(data: Restaurant) {
  const user = useAuthStore((state) => state.user)
  const navigate = useNavigate()
  const submitForApprovalMutation = useSubmitRestaurantForApprovalMutation()
  const approveMutation = useApproveRestaurantMutation()
  const requestChangesMutation = useRequestRestaurantChangesMutation()
  const rejectMutation = useRejectRestaurantMutation()
  const blockMutation = useBlockRestaurantMutation()
  const archiveMutation = useArchiveRestaurantMutation()
  const deleteMutation = useDeleteRestaurantMutation()
  const [pendingAction, setPendingAction] = useState<ConfirmAction | null>(null)

  const isSystemOwner = user?.role === UserRole.SYSTEM_OWNER
  const isClient = user?.role === UserRole.CLIENT
  const canEditRestaurant = isClient
  const canDeleteRestaurant = isClient || isSystemOwner
  const isActionPending =
    submitForApprovalMutation.isPending ||
    approveMutation.isPending ||
    requestChangesMutation.isPending ||
    rejectMutation.isPending ||
    blockMutation.isPending ||
    archiveMutation.isPending ||
    deleteMutation.isPending

  const openConfirm = (action: ConfirmAction) => {
    if (isActionPending) {
      return
    }

    setPendingAction(action)
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

    const mutations = {
      submitForApproval: submitForApprovalMutation,
      approve: approveMutation,
      requestChanges: requestChangesMutation,
      reject: rejectMutation,
      block: blockMutation,
      archive: archiveMutation
    } as const

    mutations[pendingAction].mutate(data.id, {
      onSuccess: () => setPendingAction(null)
    })
  }

  const canSubmitForApproval =
    isClient && (data.status === 'DRAFT' || data.status === 'CHANGES_REQUIRED')
  const canApprove = isSystemOwner && data.status === 'PENDING_APPROVAL'
  const canRequestChanges = isSystemOwner && data.status === 'PENDING_APPROVAL'
  const canReject = isSystemOwner && data.status === 'PENDING_APPROVAL'
  const canBlock = isSystemOwner && data.status === 'ACTIVE'
  const canRestoreFromBlocked = isSystemOwner && data.status === 'BLOCKED'
  const canArchive =
    data.status !== 'ARCHIVED' &&
    (isSystemOwner ||
      (isClient &&
        (data.status === 'DRAFT' ||
          data.status === 'CHANGES_REQUIRED' ||
          data.status === 'REJECTED')))

  const menuActions = [
    {
      key: 'edit',
      label: 'Редактировать',
      disabled: isActionPending || !canEditRestaurant,
      hidden: !canEditRestaurant,
      onClick: () => navigate(getRestaurantEditRoute(data.id))
    },
    {
      key: 'submit-for-approval',
      label: 'Отправить на модерацию',
      hidden: !canSubmitForApproval,
      disabled: isActionPending,
      onClick: () => openConfirm('submitForApproval')
    },
    {
      key: 'approve',
      label: canRestoreFromBlocked ? 'Разблокировать' : 'Одобрить',
      hidden: !(canApprove || canRestoreFromBlocked),
      disabled: isActionPending,
      onClick: () => openConfirm('approve')
    },
    {
      key: 'request-changes',
      label: 'Запросить правки',
      hidden: !canRequestChanges,
      disabled: isActionPending,
      onClick: () => openConfirm('requestChanges')
    },
    {
      key: 'reject',
      label: 'Отклонить',
      color: 'red',
      hidden: !canReject,
      disabled: isActionPending,
      onClick: () => openConfirm('reject')
    },
    {
      key: 'block',
      label: 'Заблокировать',
      color: 'red',
      hidden: !canBlock,
      disabled: isActionPending,
      onClick: () => openConfirm('block')
    },
    {
      key: 'archive',
      label: 'В архив',
      color: 'red',
      hidden: !canArchive,
      disabled: isActionPending,
      onClick: () => openConfirm('archive')
    },
    ...(canDeleteRestaurant
      ? [
          {
            key: 'delete',
            label: 'Удалить',
            color: 'red' as const,
            disabled: isActionPending,
            onClick: () => openConfirm('delete')
          }
        ]
      : [])
  ]

  const confirmModalProps =
    pendingAction === 'submitForApproval'
      ? {
          opened: true,
          title: 'Отправить ресторан на модерацию?',
          description: `Ресторан «${data.name}» перейдет в статус ожидания проверки.`,
          confirmLabel: 'Отправить',
          confirmColor: 'aurora' as const
        }
      : pendingAction === 'approve'
      ? {
          opened: true,
          title:
            data.status === 'BLOCKED'
              ? 'Разблокировать ресторан?'
              : 'Одобрить ресторан?',
          description:
            data.status === 'BLOCKED'
              ? `Ресторан «${data.name}» снова станет активным.`
              : `Ресторан «${data.name}» будет опубликован.`,
          confirmLabel:
            data.status === 'BLOCKED' ? 'Разблокировать' : 'Одобрить',
          confirmColor: 'aurora' as const
        }
      : pendingAction === 'requestChanges'
      ? {
          opened: true,
          title: 'Запросить правки по ресторану?',
          description: `Ресторан «${data.name}» будет возвращен на доработку владельцу.`,
          confirmLabel: 'Запросить правки',
          confirmColor: 'yellow' as const
        }
      : pendingAction === 'reject'
      ? {
          opened: true,
          title: 'Отклонить ресторан?',
          description: `Ресторан «${data.name}» будет отклонен без публикации.`,
          confirmLabel: 'Отклонить',
          confirmColor: 'coral' as const
        }
      : pendingAction === 'block'
      ? {
          opened: true,
          title: 'Заблокировать ресторан?',
          description: `Ресторан «${data.name}» будет скрыт из публикации и переведен в блокировку.`,
          confirmLabel: 'Заблокировать',
          confirmColor: 'coral' as const
        }
      : pendingAction === 'archive'
      ? {
          opened: true,
          title: 'Архивировать ресторан?',
          description: `Ресторан «${data.name}» будет перемещен в архив и станет недоступен.`,
          confirmLabel: 'В архив',
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
