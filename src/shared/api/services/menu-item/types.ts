import type { Category } from '@/shared/api/services/category/types'

export type MenuItem = {
  id: string
  restaurantId: string
  categoryId: string
  name: string
  description: string | null
  price: number
  image: string | null
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
  category?: Category
}

export type MenuItemMutableFields = {
  categoryId: string
  name: string
  description?: string | null
  price: number
  image?: string | null
  isActive?: boolean
  sortOrder?: number
}

export type CreateMenuItemPayload = Pick<
  MenuItemMutableFields,
  'categoryId' | 'name' | 'description' | 'price' | 'image'
>

export type UpdateMenuItemPayload = Partial<MenuItemMutableFields>
