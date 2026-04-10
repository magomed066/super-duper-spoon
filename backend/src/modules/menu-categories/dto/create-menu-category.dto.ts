import { z } from 'zod'

const menuCategoryCreateProtectedFieldsSchema = z.object({
  id: z.never(),
  restaurantId: z.never(),
  isActive: z.never(),
  createdAt: z.never(),
  updatedAt: z.never()
})

const menuCategoryDescriptionSchema = z
  .string()
  .trim()
  .max(5000, 'Description is too long')

export const createMenuCategorySchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required').max(255, 'Name is too long'),
    description: menuCategoryDescriptionSchema.nullable().optional()
  })
  .merge(menuCategoryCreateProtectedFieldsSchema.partial())
  .strict()

export type CreateMenuCategoryDto = z.infer<typeof createMenuCategorySchema>
