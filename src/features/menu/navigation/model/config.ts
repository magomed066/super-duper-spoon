import type { QueryParamConfig } from '@/shared/lib/query-string'
import type { MenuNavigationQuery } from './types'

export const menuNavigationQueryConfig: QueryParamConfig<MenuNavigationQuery> = {
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
