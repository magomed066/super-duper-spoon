import {
  CategoriesEmptyPlaceholder,
  useCategoriesQuery
} from '@/entities/category'
import { useRestaurantQueryParams } from '@/entities/restaurant'
import { ReorderCategoriesFeature } from '@/features/category/reorder-categories'
import { getApiErrorMessage } from '@/shared/api/errors'
import { Alert, Loader } from '@mantine/core'
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

  return <ReorderCategoriesFeature items={data} restaurantId={restaurantId} />
}
