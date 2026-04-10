import { z } from 'zod'

const menuItemCreateProtectedFieldsSchema = z.object({
  id: z.never(),
  restaurantId: z.never(),
  isActive: z.never(),
  createdAt: z.never(),
  updatedAt: z.never()
})

const menuItemCategoryIdSchema = z.string().uuid('Category id must be a valid UUID')

const menuItemNameSchema = z.string().trim().min(1, 'Name is required').max(255, 'Name is too long')

const menuItemDescriptionSchema = z.string().trim().max(5000, 'Description is too long')

const menuItemPriceSchema = z
  .number()
  .int('Price must be an integer')
  .positive('Price must be a positive integer in whole currency units')

const menuItemImageSchema = z.string().trim().max(500, 'Image is too long')

const menuItemSortOrderSchema = z
  .number()
  .int('Sort order must be an integer')
  .min(0, 'Sort order cannot be negative')

export const createMenuItemSchema = z
  .object({
    categoryId: menuItemCategoryIdSchema,
    name: menuItemNameSchema,
    description: menuItemDescriptionSchema.nullable().optional(),
    price: menuItemPriceSchema,
    image: menuItemImageSchema.nullable().optional(),
    sortOrder: menuItemSortOrderSchema.optional()
  })
  .merge(menuItemCreateProtectedFieldsSchema.partial())
  .strict()

export type CreateMenuItemDto = z.infer<typeof createMenuItemSchema>
