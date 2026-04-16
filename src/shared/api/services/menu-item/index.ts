import { apiService } from '../../base'
import type {
  CreateMenuItemPayload,
  MenuItem,
  UpdateMenuItemPayload
} from './types'

export class MenuItemService {
  static listByRestaurant(restaurantId: string): Promise<MenuItem[]> {
    return apiService.get(`/restaurants/${restaurantId}/items`)
  }

  static create(
    restaurantId: string,
    payload: CreateMenuItemPayload
  ): Promise<MenuItem> {
    return apiService.post(`/restaurants/${restaurantId}/items`, payload)
  }

  static update(
    restaurantId: string,
    itemId: string,
    payload: UpdateMenuItemPayload
  ): Promise<MenuItem> {
    return apiService.patch(`/restaurants/${restaurantId}/items/${itemId}`, payload)
  }

  static delete(restaurantId: string, itemId: string): Promise<void> {
    return apiService.delete(`/restaurants/${restaurantId}/items/${itemId}`)
  }
}
