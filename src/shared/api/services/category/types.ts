export type Category = {
  id: string
  restaurantId: string
  name: string
  description: string | null
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export type CategoryMutableFields = {
  name: string
  description?: string | null
  sortOrder?: number
  isActive?: boolean
}

export type CreateCategoryPayload = Pick<
  CategoryMutableFields,
  'name' | 'description' | 'sortOrder'
>

export type UpdateCategoryPayload = Partial<CategoryMutableFields>
