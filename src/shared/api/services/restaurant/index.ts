import { apiService } from '../../base'
import type {
  Restaurant,
  RestaurantsListParams,
  RestouranstsResponse
} from './types'

export class RestaurantService {
  static list(params?: RestaurantsListParams): Promise<RestouranstsResponse> {
    return apiService.get('/restaurants', { params })
  }

  static update(
    id: string,
    data: Partial<Pick<Restaurant, 'isActive'>>
  ): Promise<Restaurant> {
    return apiService.patch(`/restaurants/${id}`, data)
  }
}
