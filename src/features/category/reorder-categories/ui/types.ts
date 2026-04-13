import type { Category } from '@/entities/category'

export type Props = {
  items: Category[]
  restaurantId: string
}

export type CategoryDragItem = {
  id: string
  index: number
}

export type SortableCategoryItemProps = {
  item: Category
  index: number
  restaurantId: string
  isSorting: boolean
  draggingId: string | null
  dropTargetId: string | null
  onMove: (sourceIndex: number, targetIndex: number) => void
  onDragStart: (categoryId: string) => void
  onDragEnd: () => void
  onDropTargetChange: (categoryId: string | null) => void
}
