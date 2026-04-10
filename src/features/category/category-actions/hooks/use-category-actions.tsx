import { useState } from 'react'
import type { Category } from '@/entities/category'
import { useDeleteCategoryMutation } from '@/entities/category'

function useCategoryActions(restaurantId: string, category: Category) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const deleteMutation = useDeleteCategoryMutation(restaurantId, () =>
    setIsDeleteOpen(false)
  )

  return {
    menuActions: [
      {
        key: 'edit',
        label: 'Редактировать',
        disabled: deleteMutation.isPending,
        onClick: () => setIsEditOpen(true)
      },
      {
        key: 'delete',
        label: 'Удалить',
        color: 'red' as const,
        disabled: deleteMutation.isPending,
        onClick: () => setIsDeleteOpen(true)
      }
    ],
    isEditOpen,
    isDeleteOpen,
    closeEditModal: () => {
      if (deleteMutation.isPending) {
        return
      }

      setIsEditOpen(false)
    },
    closeDeleteModal: () => {
      if (deleteMutation.isPending) {
        return
      }

      setIsDeleteOpen(false)
    },
    handleDeleteConfirm: () => deleteMutation.mutate(category.id),
    isActionPending: deleteMutation.isPending
  }
}

export default useCategoryActions
