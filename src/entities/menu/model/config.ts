import type { MenuItem } from '@/shared/api/services/menu-item/types'
import type {
  CreateMenuItemFormValues,
  EditMenuItemFormValues
} from './validation'

export const initialCreateMenuItemValues: CreateMenuItemFormValues = {
  name: '',
  description: '',
  price: 0
}

export const getEditMenuItemInitialValues = (
  item: MenuItem
): EditMenuItemFormValues => ({
  name: item.name,
  description: item.description ?? '',
  price: item.price,
  categoryId: item.categoryId,
  isActive: item.isActive
})
