import { z } from 'zod'

import { RestaurantStatus } from '../enums/restaurant-status.enum.js'
import { workScheduleItemSchema } from './restaurant-work-schedule.dto.js'

const restaurantSystemFieldsSchema = z.object({
  status: z.never(),
  isActive: z.never(),
  createdAt: z.never(),
  updatedAt: z.never()
})

export const createRestaurantSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required').max(255, 'Name is too long'),
    slug: z
      .string()
      .trim()
      .max(255, 'Slug is too long')
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug format is invalid')
      .optional(),
    cuisine: z
      .array(
        z.string().trim().min(1, 'Cuisine item is required').max(255, 'Cuisine item is too long')
      )
      .default([]),
    email: z
      .string()
      .trim()
      .email('Email format is invalid')
      .max(255, 'Email is too long')
      .optional(),
    phones: z
      .array(z.string().trim().min(1, 'Phone is required').max(255, 'Phone is too long'))
      .default([]),
    city: z.string().trim().min(1, 'City is required').max(255, 'City is too long').optional(),
    logo: z.string().trim().max(500, 'Logo is too long').optional(),
    preview: z.string().trim().max(500, 'Preview is too long').optional(),
    workSchedule: z.array(workScheduleItemSchema).default([]),
    deliveryTime: z
      .number()
      .int('Delivery time must be an integer')
      .min(0, 'Delivery time cannot be negative')
      .optional(),
    deliveryConditions: z
      .string()
      .trim()
      .max(5000, 'Delivery conditions are too long')
      .optional(),
    description: z
      .string()
      .trim()
      .min(1, 'Description is required')
      .max(5000, 'Description is too long'),
    phone: z
      .string()
      .trim()
      .min(1, 'Phone is required')
      .max(255, 'Phone is too long'),
    address: z
      .string()
      .trim()
      .min(1, 'Address is required')
      .max(1000, 'Address is too long')
  })
  .merge(restaurantSystemFieldsSchema.partial())
  .strict()

export type CreateRestaurantDto = z.infer<typeof createRestaurantSchema>

export type CreateRestaurantDefaults = Pick<
  {
    status: RestaurantStatus
    isActive: boolean
  },
  'status' | 'isActive'
>

export const CREATE_RESTAURANT_DEFAULTS: CreateRestaurantDefaults = {
  status: RestaurantStatus.DRAFT,
  isActive: false
}
