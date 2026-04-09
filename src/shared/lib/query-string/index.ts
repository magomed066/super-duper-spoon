import queryString, {
  type ParsedQuery,
  type StringifiableRecord
} from 'query-string'

type QueryStringValue = ParsedQuery[string]

export type QueryParamConfig<T extends Record<string, unknown>> = {
  [K in keyof T]: {
    parse: (value: string | undefined) => T[K]
    serialize: (value: T[K]) => string | undefined
  }
}

const getSingleValue = (value: QueryStringValue) => {
  if (Array.isArray(value)) {
    return value[0]
  }

  return value ?? undefined
}

export function parseQueryParams<T extends Record<string, unknown>>(
  search: string,
  config: QueryParamConfig<T>
): T {
  const parsedQuery = queryString.parse(search)

  return Object.entries(config).reduce((accumulator, [key, handlers]) => {
    const typedKey = key as keyof T

    accumulator[typedKey] = handlers.parse(getSingleValue(parsedQuery[key]))

    return accumulator
  }, {} as T)
}

export function updateQueryParams<T extends Record<string, unknown>>(
  search: string,
  updates: Partial<T>,
  config: QueryParamConfig<T>
) {
  const nextQuery = queryString.parse(search) as StringifiableRecord

  Object.entries(updates).forEach(([key, value]) => {
    const typedKey = key as keyof T
    const nextValue = config[typedKey].serialize(value as T[keyof T])

    if (!nextValue) {
      delete nextQuery[key]
      return
    }

    nextQuery[key] = nextValue
  })

  return queryString.stringify(nextQuery, {
    skipEmptyString: true,
    skipNull: true
  })
}
