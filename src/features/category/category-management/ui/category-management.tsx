import { useState } from 'react'
import { Button, Flex } from '@mantine/core'
import { useRestaurantQueryParams } from '@/entities/restaurant'
import CreateCategoryModal from '@/features/category/create-category-modal'
import { TbPlus } from 'react-icons/tb'

export function CategoryManagement() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const { params } = useRestaurantQueryParams()
  const { restaurantId } = params

  return (
    <Flex justify="space-between" align="flex-end" className="ml-auto">
      <Button
        leftSection={<TbPlus size={16} />}
        onClick={() => setIsCreateModalOpen(true)}
        disabled={!restaurantId}
        color="aurora"
        radius="md"
        h={40}
        className="px-4 font-medium"
      >
        Добавить категорию
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
