import type { Category } from '@/entities/category'
import EditCategoryModal from '@/features/category/edit-category-modal'
import ConfirmModal from '@/shared/ui/confirm-modal'
import MenuActions from '@/shared/ui/menu'
import type { ActionIconProps, MenuProps } from '@mantine/core'
import type { ReactNode } from 'react'
import useCategoryActions from '../hooks/use-category-actions'

type Props = {
  data: Category
  restaurantId: string
  trigger?: ReactNode
  menuProps?: Omit<MenuProps, 'children'>
  actionIconProps?: ActionIconProps
}

export function CategoryActions({
  data,
  restaurantId,
  trigger,
  menuProps,
  actionIconProps
}: Props) {
  const {
    menuActions,
    isEditOpen,
    isDeleteOpen,
    closeEditModal,
    closeDeleteModal,
    handleDeleteConfirm,
    isActionPending
  } = useCategoryActions(restaurantId, data)

  return (
    <>
      <MenuActions
        items={menuActions}
        trigger={trigger}
        menuProps={menuProps}
        actionIconProps={actionIconProps}
      />

      <EditCategoryModal
        opened={isEditOpen}
        onClose={closeEditModal}
        restaurantId={restaurantId}
        category={data}
      />

      <ConfirmModal
        opened={isDeleteOpen}
        title="Удалить категорию?"
        description={`Категория «${data.name}» будет удалена без возможности восстановления.`}
        confirmLabel="Удалить"
        confirmColor="red"
        cancelLabel="Отмена"
        loading={isActionPending}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
      />
    </>
  )
}
