import type { QueryParamConfig } from '@/shared/lib/query-string'
import type { QueryUrlConfig } from './types'

export const ROUTES = {
  AUTH: '/',
  UNAUTHORIZED: '/401',
  APPLICATION: '/application',
  APPLICATIONS: '/applications',
  REQUEST: '/request',
  REQUEST_SUCCESS: '/request/success',
  RESTAURANTS: '/restaurants',
  RESTAURANTS_DETAILS: '/restaurants/:id',
  MENU: '/menu',
  CATEGORIES: '/categories',
  ORDERS: '/orders',
  RESTAURANTS_CREATE: '/restaurants/create',
  RESTAURANTS_EDIT: '/restaurants/:id/edit',
  NOT_FOUND: '*'
}

export const getRestaurantDetailsRoute = (id: string) => `/restaurants/${id}`
export const getRestaurantEditRoute = (id: string) => `/restaurants/${id}/edit`

export const queryUrlConfig: QueryParamConfig<QueryUrlConfig> = {
  restaurantId: {
    parse: (value) => value?.trim() ?? '',
    serialize: (value) => value.trim() || undefined
  },
  section: {
    parse: (value) => value?.trim() ?? 'dishes',
    serialize: (value) =>
      value.trim() && value !== 'dishes' ? value : undefined
  },
  categoryId: {
    parse: (value) => value?.trim() ?? '',
    serialize: (value) => value.trim() || undefined
  }
}
