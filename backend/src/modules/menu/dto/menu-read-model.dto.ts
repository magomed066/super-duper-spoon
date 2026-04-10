export interface MenuReadModelItemDto {
  id: string
  categoryId: string
  name: string
  description: string | null
  price: number
  image: string | null
  sortOrder: number
}

export interface MenuReadModelCategoryDto {
  id: string
  name: string
  description: string | null
  sortOrder: number
  items: MenuReadModelItemDto[]
}

export interface RestaurantMenuReadModelDto {
  restaurantId: string
  categories: MenuReadModelCategoryDto[]
}
