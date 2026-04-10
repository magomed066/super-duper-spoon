import { useState } from 'react'
import { Button, Flex, Select } from '@mantine/core'
import CreateCategoryModal from '@/features/category/create-category-modal'
import { useQueryParams } from '@/shared/lib/hooks/use-query-params'
import { categoryManagementQueryConfig } from '@/entities/category'
import { useRestaurantsListQuery } from '@/entities/restaurant'
import { mapSelectData } from '@/shared/lib/helpers/arrays'

export function CategoryManagement() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const { data, isError, isLoading, error } = useRestaurantsListQuery(
    true,
    {
      limit: 1000
    },
    (data) => data.pages.flatMap((page) => page.items || [])
  )
  const restaurantOptions = mapSelectData(data, 'id', 'name')

  const { params, setParams } = useQueryParams(categoryManagementQueryConfig)
  const { restaurantId } = params

  const handleSelect = (id: string | null) => {
    if (id && id !== restaurantId) {
      setParams({
        restaurantId: id
      })
    }
  }

  return (
    <Flex justify="space-between" align="flex-end">
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

      <Button
        onClick={() => setIsCreateModalOpen(true)}
        disabled={!restaurantId}
      >
        Создать категорию
      </Button>

      {restaurantId ? (
        <CreateCategoryModal
          opened={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          restaurantId={restaurantId}
        />
      ) : null}
    </Flex>
  )
}
