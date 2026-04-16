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

const menuItemPriceSchema = z.preprocess(
  (value) => {
    if (typeof value === 'string') {
      const trimmedValue = value.trim()

      if (!trimmedValue) {
        return value
      }

      const parsedValue = Number(trimmedValue)
      return Number.isNaN(parsedValue) ? value : parsedValue
    }

    return value
  },
  z
  .number()
  .int('Price must be an integer')
  .positive('Price must be a positive integer in whole currency units')
)

const allowedMenuItemImageMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml'
] as const

const menuItemImageSizeLimitBytes = 10 * 1024 * 1024

const base64DataUrlPattern =
  /^data:(?<mime>image\/(?:jpeg|png|webp|svg\+xml));base64,(?<data>[A-Za-z0-9+/]+=*)$/i

const getBase64PayloadSize = (base64Value: string): number => {
  const paddingLength = base64Value.endsWith('==')
    ? 2
    : base64Value.endsWith('=')
      ? 1
      : 0

  return Math.floor((base64Value.length * 3) / 4) - paddingLength
}

const menuItemImageSchema = z.preprocess(
  (value) => {
    if (typeof value !== 'string') {
      return value
    }

    const trimmedValue = value.trim()
    return trimmedValue ? trimmedValue : undefined
  },
  z
    .string()
    .trim()
    .refine((value) => base64DataUrlPattern.test(value), {
      message: 'Image must be a valid base64 data URL'
    })
    .refine((value) => {
      const matchedGroups = value.match(base64DataUrlPattern)?.groups
      return matchedGroups?.mime
        ? allowedMenuItemImageMimeTypes.includes(
            matchedGroups.mime.toLowerCase() as
              (typeof allowedMenuItemImageMimeTypes)[number]
          )
        : false
    }, {
      message: 'Only JPG, PNG, WEBP and SVG image files are supported'
    })
    .refine((value) => {
      const matchedGroups = value.match(base64DataUrlPattern)?.groups

      if (!matchedGroups?.data) {
        return false
      }

      return getBase64PayloadSize(matchedGroups.data) <= menuItemImageSizeLimitBytes
    }, {
      message: 'Изображение блюда должно быть не больше 10 МБ'
    })
)

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
