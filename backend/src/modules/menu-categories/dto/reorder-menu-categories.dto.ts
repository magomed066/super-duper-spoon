import { z } from 'zod'

export const reorderMenuCategoriesSchema = z
  .object({
    categoryIds: z
      .array(z.string().uuid('Category id must be a valid UUID'))
      .min(1, 'At least one category id is required')
      .refine(
        (categoryIds) => new Set(categoryIds).size === categoryIds.length,
        'Category ids must be unique'
      )
  })
  .strict()

export type ReorderMenuCategoriesDto = z.infer<typeof reorderMenuCategoriesSchema>
