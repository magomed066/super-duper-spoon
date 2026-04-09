import { z } from 'zod'

export const workScheduleItemSchema = z.object({
  day: z.string().trim().min(1, 'Work schedule day is required'),
  open: z.string().trim().min(1, 'Work schedule open time is required'),
  close: z.string().trim().min(1, 'Work schedule close time is required')
})

export type RestaurantWorkScheduleItemDto = z.infer<
  typeof workScheduleItemSchema
>
