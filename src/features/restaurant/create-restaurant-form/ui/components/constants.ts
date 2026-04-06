import type { CreateRestaurantFormValues } from '@/entities/restaurant'
import { FiClock, FiImage, FiMapPin } from 'react-icons/fi'

export const FORM_STEPS = [
  {
    key: 'basic',
    title: 'Основная информация',
    description: 'Контакты, адрес и описание ресторана.',
    icon: FiMapPin
  },
  {
    key: 'delivery',
    title: 'Доставка и график',
    description: 'Время доставки, условия и расписание кухни.',
    icon: FiClock
  },
  {
    key: 'media',
    title: 'Медиа',
    description: 'Логотип и обложка для карточки ресторана.',
    icon: FiImage
  }
] as const

export const WEEK_DAYS = [
  { day: 'monday', label: 'Понедельник' },
  { day: 'tuesday', label: 'Вторник' },
  { day: 'wednesday', label: 'Среда' },
  { day: 'thursday', label: 'Четверг' },
  { day: 'friday', label: 'Пятница' },
  { day: 'saturday', label: 'Суббота' },
  { day: 'sunday', label: 'Воскресенье' }
] as const

export const BASIC_STEP_FIELDS = [
  'name',
  'phone',
  'email',
  'city',
  'address',
  'cuisine',
  'description'
] as const satisfies ReadonlyArray<keyof CreateRestaurantFormValues>

export const DELIVERY_STEP_FIELDS = [
  'deliveryTime',
  'workSchedule'
] as const satisfies ReadonlyArray<keyof CreateRestaurantFormValues>
