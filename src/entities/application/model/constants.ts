import { ApplicationStatus } from '@/shared/api/services/application/types'

export const applicationStatus: Record<
  ApplicationStatus,
  { color: string; label: string }
> = {
  [ApplicationStatus.PENDING]: {
    color: 'orange',
    label: 'На рассмотрении'
  },
  [ApplicationStatus.APPROVED]: {
    color: 'green',
    label: 'Одобрена'
  },
  [ApplicationStatus.REJECTED]: {
    color: 'coral',
    label: 'Отклонена'
  }
}
