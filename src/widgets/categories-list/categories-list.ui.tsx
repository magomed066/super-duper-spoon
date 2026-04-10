import {
  CategoriesEmptyPlaceholder,
  CategoryCard,
  useCategoriesQuery
} from '@/entities/category'
import { getApiErrorMessage } from '@/shared/api/errors'
import { Alert, Loader, SimpleGrid, Stack } from '@mantine/core'
import { TbAlertCircle } from 'react-icons/tb'

type Props = {
  restaurantId?: string
}

export function CategoriesListWidget({ restaurantId }: Props) {
  const { data, error, isError, isLoading } = useCategoriesQuery(
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

  if (!data?.length) {
    return <CategoriesEmptyPlaceholder />
  }

  return (
    <Stack className="w-full">
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3, xl: 4 }} spacing="lg">
        {data.map((item) => (
          <CategoryCard key={item.id} data={item} />
        ))}
      </SimpleGrid>
    </Stack>
  )
}
