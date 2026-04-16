import { useState } from 'react'
import type { Category } from '@/entities/category'
import { useDeleteCategoryMutation, useUpdateCategoryMutation } from '@/entities/category'

function useCategoryActions(restaurantId: string, category: Category) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const updateMutation = useUpdateCategoryMutation(restaurantId, category.id)
  const deleteMutation = useDeleteCategoryMutation(restaurantId, () =>
    setIsDeleteOpen(false)
  )
  const isActionPending = deleteMutation.isPending || updateMutation.isPending

  return {
    menuActions: [
      {
        key: 'edit',
        label: 'Редактировать',
        disabled: isActionPending,
        onClick: () => setIsEditOpen(true)
      },
      {
        key: 'toggle-active',
        label: category.isActive ? 'Отключить' : 'Включить',
        disabled: isActionPending,
        onClick: () =>
          updateMutation.mutate({
            isActive: !category.isActive
          })
      },
      {
        key: 'delete',
        label: 'Удалить',
        color: 'red' as const,
        disabled: isActionPending,
        onClick: () => setIsDeleteOpen(true)
      }
    ],
    isEditOpen,
    isDeleteOpen,
    closeEditModal: () => {
      if (isActionPending) {
        return
      }

      setIsEditOpen(false)
    },
    closeDeleteModal: () => {
      if (isActionPending) {
        return
      }

      setIsDeleteOpen(false)
    },
    handleDeleteConfirm: () => deleteMutation.mutate(category.id),
    isActionPending
  }
}

export default useCategoryActions
