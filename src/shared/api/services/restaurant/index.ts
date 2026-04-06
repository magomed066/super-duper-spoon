import { apiService } from '../../base'
import type {
  CreateRestaurantPayload,
  CreateRestaurantResponse,
  Restaurant,
  RestaurantsListParams,
  RestouranstsResponse
} from './types'

export class RestaurantService {
  static list(params?: RestaurantsListParams): Promise<RestouranstsResponse> {
    return apiService.get('/restaurants', { params })
  }

  static create(
    data: CreateRestaurantPayload
  ): Promise<CreateRestaurantResponse> {
    return apiService.post('/restaurants', data)
  }

  static update(
    id: string,
    data: Partial<Pick<Restaurant, 'isActive'>>
  ): Promise<Restaurant> {
    return apiService.patch(`/restaurants/${id}`, data)
  }
}
