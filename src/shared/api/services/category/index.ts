import { apiService } from '../../base'
import type {
  Category,
  CreateCategoryPayload,
  ReorderCategoriesPayload,
  UpdateCategoryPayload
} from './types'

export class CategoryService {
  static listByRestaurant(restaurantId: string): Promise<Category[]> {
    return apiService.get(`/restaurants/${restaurantId}/categories`)
  }

  static create(
    restaurantId: string,
    payload: CreateCategoryPayload
  ): Promise<Category> {
    return apiService.post(`/restaurants/${restaurantId}/categories`, payload)
  }

  static update(
    restaurantId: string,
    categoryId: string,
    payload: UpdateCategoryPayload
  ): Promise<Category> {
    return apiService.patch(
      `/restaurants/${restaurantId}/categories/${categoryId}`,
      payload
    )
  }

  static delete(restaurantId: string, categoryId: string): Promise<void> {
    return apiService.delete(
      `/restaurants/${restaurantId}/categories/${categoryId}`
    )
  }

  static reorder(
    restaurantId: string,
    payload: ReorderCategoriesPayload
  ): Promise<Category[]> {
    return apiService.patch(`/restaurants/${restaurantId}/categories/reorder`, payload)
  }
}
