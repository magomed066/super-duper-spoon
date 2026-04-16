import type { Category } from './types'
import type {
  CreateCategoryFormValues,
  EditCategoryFormValues
} from './validation'

export const initialCreateCategoryValues: CreateCategoryFormValues = {
  name: '',
  description: ''
}

export const getEditCategoryInitialValues = (
  category: Category
): EditCategoryFormValues => ({
  name: category.name,
  description: category.description ?? '',
  isActive: category.isActive
})
