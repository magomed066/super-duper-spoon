import { type RequestClient } from '@/shared/api/services/application/types'
import ConfirmModal from '@/shared/ui/confirm-modal'
import MenuActions from '@/shared/ui/menu'
import useApplicationActions from '../hooks/use-application-actions'

type Props = {
  data: RequestClient
}

export function ApplicationActions(props: Props) {
  const { data } = props

  const {
    menuActions,
    canManageApplications,
    confirmModalProps,
    closeConfirmModal,
    handleConfirm,
    isActionPending
  } = useApplicationActions(data)

  if (!canManageApplications) {
    return null
  }

  return (
    <>
      <MenuActions items={menuActions} />
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
