import { z } from 'zod'
import { validateWithZod } from '@/entities/auth'

const categoryNameSchema = z
  .string()
  .trim()
  .min(1, 'Введите название категории')
  .max(255, 'Название слишком длинное')

const categoryDescriptionSchema = z
  .string()
  .trim()
  .max(5000, 'Описание слишком длинное')
  .optional()
  .default('')

export const createCategorySchema = z.object({
  name: categoryNameSchema,
  description: categoryDescriptionSchema
})

export const editCategorySchema = z.object({
  name: categoryNameSchema,
  description: categoryDescriptionSchema,
  isActive: z.boolean()
})

export type CreateCategoryFormValues = z.infer<typeof createCategorySchema>
export type EditCategoryFormValues = z.infer<typeof editCategorySchema>

export const validateCreateCategoryForm = validateWithZod(createCategorySchema)
export const validateEditCategoryForm = validateWithZod(editCategorySchema)
