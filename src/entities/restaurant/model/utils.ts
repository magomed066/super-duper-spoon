import type {
  Restaurant,
  RestaurantModerationStatus
} from '@/shared/api/services/restaurant/types'
import { RESTAURANT_MODERATION_STATUS_META } from './constants'

export const hasRestaurantStatus = (
  status: RestaurantModerationStatus,
  allowedStatuses: readonly RestaurantModerationStatus[]
) => allowedStatuses.some((allowedStatus) => allowedStatus === status)

export const declineMinuteTitle = (number: number | string) => {
  const cases = [2, 0, 1, 1, 1, 2]
  const titles = ['минута', 'минуты', 'минут']

  const mod100 = Number(number) % 100
  const mod10 = Number(number) % 10

  if (mod100 > 10 && mod100 < 20) {
    return `${number} ${titles[2]}`
  }

  return `${number} ${titles[mod10 < 5 ? cases[mod10] : cases[5]]}`
}

export const getRestaurantModerationStatusMeta = (
  status: RestaurantModerationStatus
) => RESTAURANT_MODERATION_STATUS_META[status]

export const getRestaurantActivityMeta = (isActive: boolean) =>
  isActive
    ? { label: 'Опубликован', color: 'teal' }
    : { label: 'Скрыт', color: 'gray' }

export const getRestaurantPrimaryPhone = (restaurant: Restaurant) =>
  restaurant.phone || restaurant.phones[0] || null

export const getRestaurantAddress = (restaurant: Restaurant) =>
  [restaurant.city, restaurant.address].filter(Boolean).join(', ')

const RESTAURANT_WEEKDAY_LABELS: Record<string, string> = {
  monday: 'Понедельник',
  tuesday: 'Вторник',
  wednesday: 'Среда',
  thursday: 'Четверг',
  friday: 'Пятница',
  saturday: 'Суббота',
  sunday: 'Воскресенье'
}

export const getRestaurantWeekdayLabel = (day: string) =>
  RESTAURANT_WEEKDAY_LABELS[day.trim().toLowerCase()] ?? day

export const formatRestaurantSchedule = (restaurant: Restaurant) => {
  if (!restaurant.workSchedule.length) {
    return 'Расписание не указано'
  }

  const firstOpenDay = restaurant.workSchedule.find(
    (item) => item.open && item.close
  )

  if (!firstOpenDay) {
    return 'Расписание не указано'
  }

  return `${getRestaurantWeekdayLabel(firstOpenDay.day)}: ${firstOpenDay.open} - ${firstOpenDay.close}`
}
