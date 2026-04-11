import type { MenuEditorSectionId } from '@/entities/menu'

export type MenuNavigationQuery = {
  restaurantId: string
  section: string
  categoryId: string
}

export type MenuNavigationState = {
  restaurantId: string
  selectedSectionId: MenuEditorSectionId
  selectedCategoryId: string
}
