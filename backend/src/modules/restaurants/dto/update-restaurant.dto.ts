import { z } from 'zod'

import { workScheduleItemSchema } from './create-restaurant.dto.js'

const restaurantUpdateProtectedFieldsSchema = z.object({
  status: z.never(),
  isActive: z.never(),
  createdAt: z.never(),
  updatedAt: z.never()
})

export const updateRestaurantSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required').max(255, 'Name is too long').optional(),
    slug: z
      .string()
      .trim()
      .min(1, 'Slug is required')
      .max(255, 'Slug is too long')
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug format is invalid')
      .optional(),
    phone: z
      .string()
      .trim()
      .min(1, 'Phone is required')
      .max(255, 'Phone is too long')
      .optional(),
    phones: z
      .array(z.string().trim().min(1, 'Phone is required').max(255, 'Phone is too long'))
      .optional(),
    address: z
      .string()
      .trim()
      .min(1, 'Address is required')
      .max(1000, 'Address is too long')
      .optional(),
    description: z
      .string()
      .trim()
      .min(1, 'Description is required')
      .max(5000, 'Description is too long')
      .optional(),
    email: z
      .string()
      .trim()
      .email('Email format is invalid')
      .max(255, 'Email is too long')
      .optional(),
    city: z.string().trim().min(1, 'City is required').max(255, 'City is too long').optional(),
    logo: z.string().trim().max(500, 'Logo is too long').optional(),
    preview: z.string().trim().max(500, 'Preview is too long').optional(),
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
    cuisine: z
      .array(z.string().trim().min(1, 'Cuisine item is required').max(255, 'Cuisine item is too long'))
      .optional(),
    workSchedule: z.array(workScheduleItemSchema).optional()
  })
  .merge(restaurantUpdateProtectedFieldsSchema.partial())
  .strict()
  .refine((payload) => Object.keys(payload).length > 0, {
    message: 'At least one field is required'
  })

export type UpdateRestaurantDto = z.infer<typeof updateRestaurantSchema>
