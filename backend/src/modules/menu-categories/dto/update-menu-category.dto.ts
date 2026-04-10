import { z } from 'zod'

const menuCategoryUpdateProtectedFieldsSchema = z.object({
  id: z.never(),
  restaurantId: z.never(),
  createdAt: z.never(),
  updatedAt: z.never()
})

const menuCategoryDescriptionSchema = z
  .string()
  .trim()
  .max(5000, 'Description is too long')

export const updateMenuCategorySchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required').max(255, 'Name is too long').optional(),
    description: menuCategoryDescriptionSchema.nullable().optional(),
    sortOrder: z
      .number()
      .int('Sort order must be an integer')
      .min(0, 'Sort order cannot be negative')
      .optional(),
    isActive: z.boolean().optional()
  })
  .merge(menuCategoryUpdateProtectedFieldsSchema.partial())
  .strict()
  .refine((payload) => Object.keys(payload).length > 0, {
    message: 'At least one field is required'
  })

export type UpdateMenuCategoryDto = z.infer<typeof updateMenuCategorySchema>
