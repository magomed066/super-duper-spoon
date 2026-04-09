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

  static listPublic(params?: RestaurantsListParams): Promise<RestouranstsResponse> {
    return apiService.get('/restaurants/public', { params })
  }

  static getPublicById(id: string): Promise<Restaurant> {
    return apiService.get(`/restaurants/public/${id}`)
  }

  static create(
    data: CreateRestaurantPayload
  ): Promise<CreateRestaurantResponse> {
    const formData = RestaurantService.toRestaurantFormData(data)

    return apiService.post('/restaurants', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  private static toRestaurantFormData(
    data: Partial<CreateRestaurantPayload> &
      Partial<UpdateRestaurantPayload>
  ): FormData {
    const formData = new FormData()

    if (data.name) {
      formData.append('name', data.name)
    }

    if (data.phone) {
      formData.append('phone', data.phone)
    }

    if (data.address) {
      formData.append('address', data.address)
    }

    if (data.description) {
      formData.append('description', data.description)
    }

    if (data.slug) {
      formData.append('slug', data.slug)
    }

    if (data.email) {
      formData.append('email', data.email)
    }

    if (data.city) {
      formData.append('city', data.city)
    }

    if (data.logo) {
      formData.append('logo', data.logo)
    }

    if (data.preview) {
      formData.append('preview', data.preview)
    }

    if (data.logoFile) {
      formData.append('logoFile', data.logoFile)
    }

    if (data.previewFile) {
      formData.append('previewFile', data.previewFile)
    }

    if (data.deliveryTime !== undefined) {
      formData.append('deliveryTime', String(data.deliveryTime))
    }

    if (data.deliveryConditions) {
      formData.append('deliveryConditions', data.deliveryConditions)
    }

    if (data.cuisine?.length) {
      formData.append('cuisine', JSON.stringify(data.cuisine))
    }

    if (data.phones?.length) {
      formData.append('phones', JSON.stringify(data.phones))
    }

    if (data.workSchedule?.length) {
      formData.append('workSchedule', JSON.stringify(data.workSchedule))
    }

    if (data.isActive !== undefined) {
      formData.append('isActive', String(data.isActive))
    }

    return formData
  }

  static update(
    id: string,
    data: UpdateRestaurantPayload
  ): Promise<Restaurant> {
    if (data.logoFile || data.previewFile) {
      return apiService.patch(`/restaurants/${id}`, RestaurantService.toRestaurantFormData(data), {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    }

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
