import type { QueryParamConfig } from '@/shared/lib/query-string'
import type { CategoryManagementQuery } from './types'

export const categoryManagementQueryConfig: QueryParamConfig<CategoryManagementQuery> =
  {
    restaurantId: {
      parse: (value) => value?.trim() ?? '',
      serialize: (value) => value.trim() || undefined
    }
  }
