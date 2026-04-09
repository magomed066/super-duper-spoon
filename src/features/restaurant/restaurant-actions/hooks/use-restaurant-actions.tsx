import {
  DEFAULT_RESTAURANT_STATUS_BY_ROLE,
  RESTAURANT_ARCHIVABLE_BY_CLIENT_STATUSES,
  RESTAURANT_ARCHIVABLE_BY_SYSTEM_OWNER_STATUSES,
  RESTAURANT_DELETABLE_STATUSES,
  RESTAURANT_EDITABLE_STATUSES,
  RESTAURANT_SUBMITTABLE_STATUSES,
  hasRestaurantStatus,
  useApproveRestaurantMutation,
  useArchiveRestaurantMutation,
  useBlockRestaurantMutation,
  useDeleteRestaurantMutation,
  useRejectRestaurantMutation,
  useRequestRestaurantChangesMutation,
  useUnblockRestaurantMutation,
  useSubmitRestaurantForApprovalMutation
} from '@/entities/restaurant'
import { useAuthStore } from '@/entities/auth'
import { UserRole } from '@/shared/api/services/auth/types'
import { getRestaurantEditRoute, ROUTES } from '@/shared/config/routes'
import {
  RestaurantModerationStatus,
  type Restaurant
} from '@/shared/api/services/restaurant/types'
import { useState } from 'react'
import { useNavigate } from 'react-router'

type ConfirmAction =
  | 'submitForApproval'
  | 'approve'
  | 'requestChanges'
  | 'reject'
  | 'block'
  | 'unblock'
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
  const unblockMutation = useUnblockRestaurantMutation()
  const archiveMutation = useArchiveRestaurantMutation()
  const deleteMutation = useDeleteRestaurantMutation()
  const [pendingAction, setPendingAction] = useState<ConfirmAction | null>(null)

  const isSystemOwner = user?.role === UserRole.SYSTEM_OWNER
  const isClient = user?.role === UserRole.CLIENT
  const canEditRestaurant =
    isClient && hasRestaurantStatus(data.status, RESTAURANT_EDITABLE_STATUSES)
  const canDeleteRestaurant =
    isSystemOwner ||
    (isClient && hasRestaurantStatus(data.status, RESTAURANT_DELETABLE_STATUSES))
  const isActionPending =
    submitForApprovalMutation.isPending ||
    approveMutation.isPending ||
    requestChangesMutation.isPending ||
    rejectMutation.isPending ||
    blockMutation.isPending ||
    unblockMutation.isPending ||
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
        onSuccess: () => {
          setPendingAction(null)
          navigate(ROUTES.RESTAURANTS)
        }
      })
      return
    }

    const mutations = {
      submitForApproval: submitForApprovalMutation,
      approve: approveMutation,
      requestChanges: requestChangesMutation,
      reject: rejectMutation,
      block: blockMutation,
      unblock: unblockMutation,
      archive: archiveMutation
    } as const

    mutations[pendingAction].mutate(data.id, {
      onSuccess: () => setPendingAction(null)
    })
  }

  const canSubmitForApproval =
    isClient &&
    hasRestaurantStatus(data.status, RESTAURANT_SUBMITTABLE_STATUSES)
  const canApprove =
    isSystemOwner &&
    data.status === DEFAULT_RESTAURANT_STATUS_BY_ROLE[UserRole.SYSTEM_OWNER]
  const canRequestChanges =
    isSystemOwner &&
    data.status === DEFAULT_RESTAURANT_STATUS_BY_ROLE[UserRole.SYSTEM_OWNER]
  const canReject =
    isSystemOwner &&
    data.status === DEFAULT_RESTAURANT_STATUS_BY_ROLE[UserRole.SYSTEM_OWNER]
  const canBlock =
    isSystemOwner && data.status === RestaurantModerationStatus.ACTIVE
  const canRestoreFromBlocked =
    isSystemOwner && data.status === RestaurantModerationStatus.BLOCKED
  const canArchive =
    (isSystemOwner &&
      hasRestaurantStatus(
        data.status,
        RESTAURANT_ARCHIVABLE_BY_SYSTEM_OWNER_STATUSES
      )) ||
    (isClient &&
      hasRestaurantStatus(data.status, RESTAURANT_ARCHIVABLE_BY_CLIENT_STATUSES))

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
      label: 'Одобрить',
      hidden: !canApprove,
      disabled: isActionPending,
      onClick: () => openConfirm('approve')
    },
    {
      key: 'unblock',
      label: 'Разблокировать',
      hidden: !canRestoreFromBlocked,
      disabled: isActionPending,
      onClick: () => openConfirm('unblock')
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
          title: 'Одобрить ресторан?',
          description: `Ресторан «${data.name}» будет опубликован.`,
          confirmLabel: 'Одобрить',
          confirmColor: 'aurora' as const
        }
      : pendingAction === 'unblock'
      ? {
          opened: true,
          title: 'Разблокировать ресторан?',
          description: `Ресторан «${data.name}» снова станет активным.`,
          confirmLabel: 'Разблокировать',
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
