import { z } from 'zod'
import { validateWithZod } from '@/entities/auth'

export const createRestaurantWorkDaySchema = z.object({
  day: z.string().trim().min(1, 'Укажите день недели'),
  enabled: z.boolean(),
  open: z.string().trim(),
  close: z.string().trim()
})

export const createRestaurantSchema = z.object({
  name: z.string().min(2, 'Введите название ресторана'),
  logo: z.string().url('Введите корректный URL логотипа').or(z.literal('')),
  preview: z.string().url('Введите корректный URL обложки').or(z.literal('')),
  phone: z
    .string()
    .regex(
      /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/,
      'Введите номер в формате +7 (999) 123-45-67'
    ),
  address: z.string().min(5, 'Введите адрес'),
  description: z.string().min(5, 'Добавьте описание ресторана'),
  email: z.email('Введите корректный email'),
  city: z.string().min(5, 'Укажите ваш город'),
  deliveryTime: z
    .string()
    .trim()
    .min(1, 'Укажите время доставки')
    .refine((value) => /^\d+$/.test(value), 'Введите время доставки в минутах'),
  cuisine: z.string().min(5, 'Укажите вашу кухню'),
  deliveryConditions: z.string().min(5, 'Добавьте условия доставки'),
  workSchedule: z
    .array(createRestaurantWorkDaySchema)
    .refine(
      (items) => items.some((item) => item.enabled),
      'Добавьте хотя бы один рабочий день'
    )
    .superRefine((items, ctx) => {
      items.forEach((item, index) => {
        if (!item.enabled) {
          return
        }

        if (!item.open) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Укажите время открытия',
            path: [index, 'open']
          })
        }

        if (!item.close) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Укажите время закрытия',
            path: [index, 'close']
          })
        }

        if (item.open && item.close && item.open >= item.close) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Время закрытия должно быть позже открытия',
            path: [index, 'close']
          })
        }
      })
    })
})

export type CreateRestaurantFormValues = z.infer<typeof createRestaurantSchema>

export const validateCreateRestaurantForm = validateWithZod(
  createRestaurantSchema
)
