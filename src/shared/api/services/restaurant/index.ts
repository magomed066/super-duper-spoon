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
    const formData = new FormData()

    formData.append('name', data.name)
    formData.append('phone', data.phone)
    formData.append('address', data.address)
    formData.append('description', data.description)

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

    return apiService.post('/restaurants', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  static update(
    id: string,
    data: Partial<Pick<Restaurant, 'isActive'>>
  ): Promise<Restaurant> {
    return apiService.patch(`/restaurants/${id}`, data)
  }
}
