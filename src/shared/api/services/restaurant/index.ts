import { apiService } from '../../base'
import type {
  AssignRestaurantManagerPayload,
  CreateRestaurantPayload,
  CreateRestaurantResponse,
  Restaurant,
  RestaurantMembership,
  UpdateRestaurantPayload,
  RestaurantsListParams,
  RestouranstsResponse
} from './types'

export class RestaurantService {
  static list(params?: RestaurantsListParams): Promise<RestouranstsResponse> {
    return apiService.get('/restaurants', { params })
  }

  static getById(id: string): Promise<Restaurant> {
    return apiService.get(`/restaurants/${id}`)
  }

  static listPublic(
    params?: RestaurantsListParams
  ): Promise<RestouranstsResponse> {
    return apiService.get('/restaurants/public', { params })
  }

  static getPublicById(id: string): Promise<Restaurant> {
    return apiService.get(`/restaurants/public/${id}`)
  }

  static create(
    data: CreateRestaurantPayload
  ): Promise<CreateRestaurantResponse> {
    return apiService.post('/restaurants', data)
  }

  static update(
    id: string,
    data: UpdateRestaurantPayload
  ): Promise<Restaurant> {
    return apiService.patch(`/restaurants/${id}`, data)
  }

  static delete(id: string): Promise<{ message?: string }> {
    return apiService.delete(`/restaurants/${id}`)
  }

  static submitForApproval(id: string): Promise<Restaurant> {
    return apiService.post(`/restaurants/${id}/submit-for-approval`)
  }

  static approve(id: string): Promise<Restaurant> {
    return apiService.post(`/restaurants/${id}/approve`)
  }

  static requestChanges(id: string): Promise<Restaurant> {
    return apiService.post(`/restaurants/${id}/request-changes`)
  }

  static reject(id: string): Promise<Restaurant> {
    return apiService.post(`/restaurants/${id}/reject`)
  }

  static block(id: string): Promise<Restaurant> {
    return apiService.post(`/restaurants/${id}/block`)
  }

  static unblock(id: string): Promise<Restaurant> {
    return apiService.post(`/restaurants/${id}/unblock`)
  }

  static archive(id: string): Promise<Restaurant> {
    return apiService.post(`/restaurants/${id}/archive`)
  }

  static getUsers(id: string): Promise<RestaurantMembership[]> {
    return apiService.get(`/restaurants/${id}/users`)
  }

  static assignManager(
    id: string,
    payload: AssignRestaurantManagerPayload
  ): Promise<RestaurantMembership> {
    return apiService.post(`/restaurants/${id}/managers`, payload)
  }

  static removeManager(id: string, userId: string): Promise<void> {
    return apiService.delete(`/restaurants/${id}/managers/${userId}`)
  }
}
