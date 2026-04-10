import CategoryModal from '@/features/category/category-modal'

type Props = {
  opened: boolean
  onClose: () => void
  restaurantId: string
}

export function CreateCategoryModal({ opened, onClose, restaurantId }: Props) {
  return (
    <CategoryModal
      opened={opened}
      onClose={onClose}
      restaurantId={restaurantId}
    />
  )
}
