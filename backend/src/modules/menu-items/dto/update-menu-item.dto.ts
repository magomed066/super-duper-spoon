import { z } from 'zod'

const menuItemUpdateProtectedFieldsSchema = z.object({
  id: z.never(),
  restaurantId: z.never(),
  createdAt: z.never(),
  updatedAt: z.never()
})

const menuItemCategoryIdSchema = z.string().uuid('Category id must be a valid UUID')

const menuItemNameSchema = z.string().trim().min(1, 'Name is required').max(255, 'Name is too long')

const menuItemDescriptionSchema = z.string().trim().max(5000, 'Description is too long')

const menuItemPriceSchema = z.preprocess(
  (value) => {
    if (typeof value === 'string') {
      const trimmedValue = value.trim()

      if (!trimmedValue) {
        return value
      }

      const parsedValue = Number(trimmedValue)
      return Number.isNaN(parsedValue) ? value : parsedValue
    }

    return value
  },
  z
  .number()
  .int('Price must be an integer')
  .positive('Price must be a positive integer in whole currency units')
)

const menuItemImageSchema = z.preprocess(
  (value) => {
    if (typeof value !== 'string') {
      return value
    }

    const trimmedValue = value.trim()
    return trimmedValue ? trimmedValue : undefined
  },
  z.string().trim().max(500, 'Image is too long')
)

const menuItemBooleanSchema = z.preprocess((value) => {
  if (typeof value !== 'string') {
    return value
  }

  const normalizedValue = value.trim().toLowerCase()

  if (normalizedValue === 'true') {
    return true
  }

  if (normalizedValue === 'false') {
    return false
  }

  return value
}, z.boolean())

const menuItemSortOrderSchema = z.preprocess(
  (value) => {
    if (typeof value === 'string') {
      const trimmedValue = value.trim()

      if (!trimmedValue) {
        return value
      }

      const parsedValue = Number(trimmedValue)
      return Number.isNaN(parsedValue) ? value : parsedValue
    }

    return value
  },
  z
    .number()
    .int('Sort order must be an integer')
    .min(0, 'Sort order cannot be negative')
)

export const updateMenuItemSchema = z
  .object({
    categoryId: menuItemCategoryIdSchema.optional(),
    name: menuItemNameSchema.optional(),
    description: menuItemDescriptionSchema.nullable().optional(),
    price: menuItemPriceSchema.optional(),
    image: menuItemImageSchema.nullable().optional(),
    isActive: menuItemBooleanSchema.optional(),
    sortOrder: menuItemSortOrderSchema.optional()
  })
  .merge(menuItemUpdateProtectedFieldsSchema.partial())
  .strict()
  .refine((payload) => Object.keys(payload).length > 0, {
    message: 'At least one field is required'
  })

export type UpdateMenuItemDto = z.infer<typeof updateMenuItemSchema>
