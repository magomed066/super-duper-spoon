import { CREATE_RESTAURANT_DEFAULTS } from '../dto/create-restaurant.dto.js'
import type { Restaurant } from '../entities/restaurant.entity.js'
import type { RestaurantUser } from '../entities/restaurant-user.entity.js'
import type {
  NormalizedCreateRestaurantInput,
  RestaurantMembershipDto,
  UpdateRestaurantInput
} from '../types/restaurant.service.types.js'
import type { User } from '../../users/entities/user.entity.js'

export function buildRestaurantEmail(slug: string): string {
  return `${slug}@restaurant.local`
}

export function toRestaurantMembershipDto(
  membership: RestaurantUser & { user: User }
): RestaurantMembershipDto {
  return {
    id: membership.id,
    restaurantId: membership.restaurantId,
    userId: membership.userId,
    role: membership.role,
    isActive: membership.isActive,
    createdAt: membership.createdAt,
    user: {
      id: membership.user.id,
      firstName: membership.user.firstName,
      lastName: membership.user.lastName,
      phone: membership.user.phone,
      email: membership.user.email,
      status: membership.user.status,
      role: membership.user.role,
      isActive: membership.user.isActive,
      createdAt: membership.user.createdAt
    }
  }
}

export function toRestaurantEntity(
  payload: NormalizedCreateRestaurantInput,
  email: string
): Partial<Restaurant> {
  return {
    name: payload.name,
    slug: payload.slug,
    email,
    phone: payload.phone,
    phones: payload.phones.length > 0 ? payload.phones : [payload.phone],
    address: payload.address,
    description: payload.description,
    city: payload.city ?? 'TBD',
    logo: payload.logo ?? '',
    preview: payload.preview ?? '',
    deliveryTime: payload.deliveryTime ?? 0,
    deliveryConditions: payload.deliveryConditions ?? '',
    cuisine: payload.cuisine,
    workSchedule: payload.workSchedule,
    status: CREATE_RESTAURANT_DEFAULTS.status,
    isActive: CREATE_RESTAURANT_DEFAULTS.isActive
  }
}

export function toUpdatedRestaurantEntity(
  restaurant: Restaurant,
  payload: UpdateRestaurantInput
): Partial<Restaurant> {
  return {
    name: payload.name ?? restaurant.name,
    slug: payload.slug ?? restaurant.slug,
    email: payload.email ?? restaurant.email,
    phone: payload.phone ?? restaurant.phone,
    phones: payload.phones ?? restaurant.phones,
    address: payload.address ?? restaurant.address,
    description: payload.description ?? restaurant.description,
    city: payload.city ?? restaurant.city,
    logo: payload.logo ?? restaurant.logo,
    preview: payload.preview ?? restaurant.preview,
    deliveryTime: payload.deliveryTime ?? restaurant.deliveryTime,
    deliveryConditions: payload.deliveryConditions ?? restaurant.deliveryConditions,
    cuisine: payload.cuisine ?? restaurant.cuisine,
    workSchedule: payload.workSchedule ?? restaurant.workSchedule
  }
}
