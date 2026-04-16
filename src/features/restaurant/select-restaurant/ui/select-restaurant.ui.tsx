import {
  useRestaurantQueryParams,
  useRestaurantsListQuery
} from '@/entities/restaurant'
import { mapSelectData } from '@/shared/lib/helpers/arrays'
import { Select } from '@mantine/core'

export function SelectRestaurantFeature() {
  const { data, isError, isLoading, error } = useRestaurantsListQuery(
    true,
    {
      limit: 1000
    },
    (data) => data.pages.flatMap((page) => page.items || [])
  )
  const restaurantOptions = mapSelectData(data, 'id', 'name')

  const { params, setParams } = useRestaurantQueryParams()
  const { restaurantId } = params

  const handleSelect = (id: string | null) => {
    if (id && id !== restaurantId) {
      setParams({
        restaurantId: id
      })
    }
  }

  return (
    <Select
      label="Ресторан"
      placeholder="Выберите ресторан"
      data={restaurantOptions}
      value={restaurantId || null}
      onChange={handleSelect}
      searchable
      error={error?.message}
      loading={!isError && isLoading}
      nothingFoundMessage="Рестораны не найдены"
      disabled={!isLoading && restaurantOptions.length === 0}
      className="max-w-xl"
    />
  )
}
