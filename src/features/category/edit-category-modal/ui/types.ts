import type { Category } from '@/entities/category'

export type Props = {
  opened: boolean
  onClose: () => void
  restaurantId: string
  category: Category
}
