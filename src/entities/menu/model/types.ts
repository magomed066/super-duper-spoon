import type { Category } from '@/entities/category'
import type { ComponentType } from 'react'

export type MenuEditorSectionId =
  | 'dishes'
  | 'addons'
  | 'categories'
  | 'order-extras'

export type MenuEditorSection = {
  id: MenuEditorSectionId
  title: string
  description: string
  icon: ComponentType<{ size?: number }>
  disabled?: boolean
}

export type MenuEditorSidebarProps = Record<string, never>

export type MenuEditorContentProps = Record<string, never>

export type MenuEditorCategoriesProps = {
  restaurantId: string
  selectedCategoryId: string
  activeCategoriesCount: number
  categories?: Category[]
  isCategoriesLoading: boolean
  isCategoriesError: boolean
  categoriesErrorMessage?: string
  onCategorySelect: (categoryId: string) => void
}
