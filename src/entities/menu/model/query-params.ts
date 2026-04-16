import { createUseQueryParams } from '@/shared/lib/hooks/use-query-params'
import type { QueryParamConfig } from '@/shared/lib/query-string'

export type Config = {
  restaurantId: string
  section: string
  categoryId: string
}

export const queryUrlConfig: QueryParamConfig<Config> = {
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

export const useMenuQueryParams = createUseQueryParams(queryUrlConfig)
