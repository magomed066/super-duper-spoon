import {
  useApproveApplicationMutation,
  useRejectApplicationMutation
} from '@/entities/application'
import { AuthPermission, hasPermission, useAuthStore } from '@/entities/auth'
import {
  ApplicationStatus,
  type RequestClient
} from '@/shared/api/services/application/types'

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

  const handleApprove = (id: string, restaurantName: string) => {
    if (!canManageApplications) {
      return
    }

    const isConfirmed = window.confirm(
      `Подтвердить заявку ресторана «${restaurantName}»? Будет создан аккаунт клиента.`
    )

    if (!isConfirmed) {
      return
    }

    approveMutation.mutate(id)
  }

  const handleReject = (id: string, restaurantName: string) => {
    if (!canManageApplications) {
      return
    }

    const isConfirmed = window.confirm(
      `Отклонить заявку ресторана «${restaurantName}»?`
    )

    if (!isConfirmed) {
      return
    }

    rejectMutation.mutate(id)
  }

  const menuActions = [
    {
      key: 'approve',
      label: 'Подтвердить',
      disabled: !canManageApplications || !isPending || isActionPending,
      onClick: () => handleApprove(data.id, data.restaurantName)
    },
    {
      key: 'reject',
      label: 'Отказать',
      color: 'red',
      disabled: !canManageApplications || !isPending || isActionPending,
      onClick: () => handleReject(data.id, data.restaurantName)
    }
  ]

  return { menuActions, canManageApplications }
}

export default useApplicationActions
