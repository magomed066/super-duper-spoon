import { z } from 'zod'

export const assignRestaurantManagerSchema = z
  .object({
    userId: z.string().trim().min(1, 'User id is required')
  })
  .strict()

export type AssignRestaurantManagerDto = z.infer<
  typeof assignRestaurantManagerSchema
>
