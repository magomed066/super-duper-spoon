import { apiService } from '../../base'
import type { Restaurant } from './types'

export class RestaurantService {
  static list(): Promise<Restaurant[]> {
    return apiService.get('/restaurants')
  }

  static update(
    id: string,
    data: Partial<Pick<Restaurant, 'isActive'>>
  ): Promise<Restaurant> {
    return apiService.patch(`/restaurants/${id}`, data)
  }
}
