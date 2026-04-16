import { z } from 'zod'

import { workScheduleItemSchema } from './restaurant-work-schedule.dto.js'

const restaurantUpdateProtectedFieldsSchema = z.object({
  status: z.never(),
  isActive: z.never(),
  createdAt: z.never(),
  updatedAt: z.never()
})

const createBase64ImageSchema = (
  allowedMimeTypes: readonly string[],
  maxSizeMb: number,
  invalidMessage: string,
  sizeMessage: string
) => {
  const maxSizeBytes = maxSizeMb * 1024 * 1024
  const mimePattern = allowedMimeTypes
    .map((mimeType) => mimeType.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|')
  const base64DataUrlPattern = new RegExp(
    `^data:(?<mime>${mimePattern});base64,(?<data>[A-Za-z0-9+/]+=*)$`,
    'i'
  )

  const getBase64PayloadSize = (base64Value: string): number => {
    const paddingLength = base64Value.endsWith('==')
      ? 2
      : base64Value.endsWith('=')
        ? 1
        : 0

    return Math.floor((base64Value.length * 3) / 4) - paddingLength
  }

  return z
    .string()
    .trim()
    .refine((value) => base64DataUrlPattern.test(value), {
      message: invalidMessage
    })
    .refine((value) => {
      const matchedGroups = value.match(base64DataUrlPattern)?.groups
      return matchedGroups?.mime
        ? allowedMimeTypes.includes(matchedGroups.mime.toLowerCase())
        : false
    }, {
      message: invalidMessage
    })
    .refine((value) => {
      const matchedGroups = value.match(base64DataUrlPattern)?.groups

      if (!matchedGroups?.data) {
        return false
      }

      return getBase64PayloadSize(matchedGroups.data) <= maxSizeBytes
    }, {
      message: sizeMessage
    })
}

const logoImageSchema = z.preprocess(
  (value) => {
    if (typeof value !== 'string') {
      return value
    }

    const trimmedValue = value.trim()
    return trimmedValue ? trimmedValue : undefined
  },
  createBase64ImageSchema(
    ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
    5,
    'Logo must be a valid base64 data URL in JPG, PNG, WEBP, or SVG format',
    'Логотип должен быть не больше 5 МБ'
  )
)

const previewImageSchema = z.preprocess(
  (value) => {
    if (typeof value !== 'string') {
      return value
    }

    const trimmedValue = value.trim()
    return trimmedValue ? trimmedValue : undefined
  },
  createBase64ImageSchema(
    ['image/jpeg', 'image/png', 'image/webp'],
    10,
    'Preview must be a valid base64 data URL in JPG, PNG, or WEBP format',
    'Обложка должна быть не больше 10 МБ'
  )
)

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
    logo: logoImageSchema.optional(),
    preview: previewImageSchema.optional(),
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
