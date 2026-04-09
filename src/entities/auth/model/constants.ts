import { UserRole } from '@/shared/api/services/auth/types'

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.SYSTEM_OWNER]: 'Владелец системы',
  [UserRole.CLIENT]: 'Владелец ресторана',
  [UserRole.STAFF]: 'Сотрудник'
}
