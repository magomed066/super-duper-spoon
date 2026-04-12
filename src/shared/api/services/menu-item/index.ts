import { apiService } from '../../base'
import type {
  CreateMenuItemPayload,
  MenuItem,
  UpdateMenuItemPayload
} from './types'

export class MenuItemService {
  private static toMenuItemFormData(
    data: Partial<CreateMenuItemPayload> &
      Partial<UpdateMenuItemPayload>
  ): FormData {
    const formData = new FormData()

    if (data.categoryId) {
      formData.append('categoryId', data.categoryId)
    }

    if (data.name) {
      formData.append('name', data.name)
    }

    if (data.description) {
      formData.append('description', data.description)
    }

    if (data.price !== undefined) {
      formData.append('price', String(data.price))
    }

    if (data.image) {
      formData.append('image', data.image)
    }

    if (data.imageFile) {
      formData.append('imageFile', data.imageFile)
    }

    if (data.isActive !== undefined) {
      formData.append('isActive', String(data.isActive))
    }

    if (data.sortOrder !== undefined) {
      formData.append('sortOrder', String(data.sortOrder))
    }

    return formData
  }

  static listByRestaurant(restaurantId: string): Promise<MenuItem[]> {
    return apiService.get(`/restaurants/${restaurantId}/items`)
  }

  static create(
    restaurantId: string,
    payload: CreateMenuItemPayload
  ): Promise<MenuItem> {
    if (payload.imageFile) {
      return apiService.post(
        `/restaurants/${restaurantId}/items`,
        MenuItemService.toMenuItemFormData(payload),
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
    }

    return apiService.post(`/restaurants/${restaurantId}/items`, payload)
  }

  static update(
    restaurantId: string,
    itemId: string,
    payload: UpdateMenuItemPayload
  ): Promise<MenuItem> {
    if (payload.imageFile) {
      return apiService.patch(
        `/restaurants/${restaurantId}/items/${itemId}`,
        MenuItemService.toMenuItemFormData(payload),
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
    }

    return apiService.patch(`/restaurants/${restaurantId}/items/${itemId}`, payload)
  }

  static delete(restaurantId: string, itemId: string): Promise<void> {
    return apiService.delete(`/restaurants/${restaurantId}/items/${itemId}`)
  }
}
