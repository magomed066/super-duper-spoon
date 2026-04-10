import { z } from 'zod'
import { validateWithZod } from '@/entities/auth'

export const createCategorySchema = z.object({
  name: z.string().trim().min(1, 'Введите название категории').max(255, 'Название слишком длинное'),
  description: z
    .string()
    .trim()
    .max(5000, 'Описание слишком длинное')
    .optional()
    .default(''),
  sortOrder: z
    .string()
    .trim()
    .min(1, 'Укажите порядок сортировки')
    .refine((value) => /^\d+$/.test(value), 'Введите целое число не меньше 0')
})

export type CreateCategoryFormValues = z.infer<typeof createCategorySchema>

export const validateCreateCategoryForm = validateWithZod(createCategorySchema)
