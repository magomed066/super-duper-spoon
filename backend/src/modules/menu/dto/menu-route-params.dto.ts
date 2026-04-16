import { z } from 'zod'

const restaurantIdSchema = z.string().uuid('Restaurant id must be a valid UUID')
const categoryIdSchema = z.string().uuid('Category id must be a valid UUID')
const itemIdSchema = z.string().uuid('Menu item id must be a valid UUID')

export const restaurantMenuParamsSchema = z
  .object({
    restaurantId: restaurantIdSchema
  })
  .strict()

export const restaurantMenuCategoryParamsSchema = z
  .object({
    restaurantId: restaurantIdSchema,
    categoryId: categoryIdSchema
  })
  .strict()

export const restaurantMenuItemParamsSchema = z
  .object({
    restaurantId: restaurantIdSchema,
    itemId: itemIdSchema
  })
  .strict()
