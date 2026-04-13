import {
  CategoriesEmptyPlaceholder,
  CategoryCard,
  useCategoriesQuery
} from '@/entities/category'
import { useRestaurantQueryParams } from '@/entities/restaurant'
import CategoryActions from '@/features/category/category-actions'
import { getApiErrorMessage } from '@/shared/api/errors'
import { Alert, Loader, Stack } from '@mantine/core'
import { TbAlertCircle } from 'react-icons/tb'

export function CategoriesListWidget() {
  const { params } = useRestaurantQueryParams()
  const { restaurantId } = params

  const { data, isError, error, isLoading } = useCategoriesQuery(
    restaurantId,
    Boolean(restaurantId)
  )

  if (isError) {
    return (
      <Alert
        color="coral"
        radius="md"
        title="Не удалось загрузить категории"
        icon={<TbAlertCircle size={18} />}
      >
        {getApiErrorMessage(error)}
      </Alert>
    )
  }

  if (isLoading) {
    return <Loader className="mx-auto" />
  }

  if (!restaurantId || !data?.length) {
    return <CategoriesEmptyPlaceholder />
  }

  return (
    <Stack className="w-full">
      {data.map((item) => (
        <CategoryCard
          key={item.id}
          data={item}
          renderActions={(category) => (
            <CategoryActions
              data={category}
              restaurantId={restaurantId}
              actionIconProps={{ variant: 'default' }}
            />
          )}
        />
      ))}
    </Stack>
  )
}
