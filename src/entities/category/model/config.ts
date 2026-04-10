import type { QueryParamConfig } from '@/shared/lib/query-string'
import type { Category, CategoryManagementQuery } from './types'
import type {
  CreateCategoryFormValues,
  EditCategoryFormValues
} from './validation'

export const categoryManagementQueryConfig: QueryParamConfig<CategoryManagementQuery> =
  {
    restaurantId: {
      parse: (value) => value?.trim() ?? '',
      serialize: (value) => value.trim() || undefined
    }
  }

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
