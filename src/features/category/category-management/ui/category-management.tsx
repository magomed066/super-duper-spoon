import { useState } from 'react'
import { Button, Flex } from '@mantine/core'
import CreateCategoryModal from '@/features/category/create-category-modal'
import { useQueryParams } from '@/shared/lib/hooks/use-query-params'
import { restaurantQueryUrlConfig } from '@/entities/restaurant'

export function CategoryManagement() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const { params } = useQueryParams(restaurantQueryUrlConfig)
  const { restaurantId } = params

  return (
    <Flex justify="space-between" align="flex-end">
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
