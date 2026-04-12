import { z } from 'zod'
import { validateWithZod } from '@/entities/auth'

const menuItemNameSchema = z
  .string()
  .trim()
  .min(1, 'Введите название блюда')
  .max(255, 'Название слишком длинное')

const menuItemDescriptionSchema = z
  .string()
  .trim()
  .max(5000, 'Описание слишком длинное')
  .optional()
  .default('')

const menuItemPriceSchema = z
  .number({
    error: 'Укажите цену'
  })
  .int('Цена должна быть целым числом')
  .positive('Цена должна быть больше нуля')

export const createMenuItemSchema = z.object({
  name: menuItemNameSchema,
  description: menuItemDescriptionSchema,
  price: menuItemPriceSchema
})

export type CreateMenuItemFormValues = z.infer<typeof createMenuItemSchema>

export const validateCreateMenuItemForm = validateWithZod(createMenuItemSchema)
