import { useCallback, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  parseQueryParams,
  updateQueryParams,
  type QueryParamConfig
} from '@/shared/lib/query-string'

type SetQueryParamsOptions = {
  replace?: boolean
}

export function useQueryParams<T extends Record<string, unknown>>(
  config: QueryParamConfig<T>
) {
  const location = useLocation()
  const navigate = useNavigate()

  const params = useMemo(
    () => parseQueryParams(location.search, config),
    [config, location.search]
  )

  const setParams = useCallback(
    (updates: Partial<T>, options?: SetQueryParamsOptions) => {
      const nextSearch = updateQueryParams(location.search, updates, config)
      const currentSearch = location.search.startsWith('?')
        ? location.search.slice(1)
        : location.search

      if (nextSearch === currentSearch) {
        return
      }

      navigate(
        {
          pathname: location.pathname,
          search: nextSearch ? `?${nextSearch}` : ''
        },
        { replace: options?.replace ?? true }
      )
    },
    [config, location.pathname, location.search, navigate]
  )

  return {
    params,
    setParams
  }
}

export function createUseQueryParams<T extends Record<string, unknown>>(
  config: QueryParamConfig<T>
) {
  return function useConfiguredQueryParams() {
    return useQueryParams(config)
  }
}
