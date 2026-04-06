import { type RequestClient } from '@/shared/api/services/application/types'
import MenuActions from '@/shared/ui/menu'
import useApplicationActions from '../hooks/use-application-actions'

type Props = {
  data: RequestClient
}

export function ApplicationActions(props: Props) {
  const { data } = props

  const { menuActions, canManageApplications } = useApplicationActions(data)

  if (!canManageApplications) {
    return null
  }

  return <MenuActions items={menuActions} />
}

// owner 5 - rIXl2SBqPXXL
