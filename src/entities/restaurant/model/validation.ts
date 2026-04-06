import { z } from 'zod'
import { validateWithZod } from '@/entities/auth'

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
  description: z.string().min(10, 'Добавьте описание ресторана'),
  email: z.email('Введите корректный email'),
  city: z.string().min(5, 'Укажите ваш город'),
  deliveryTime: z
    .number({ error: 'Укажите время доставки' })
    .int('Время доставки должно быть целым числом')
    .min(0, 'Время доставки не может быть отрицательным'),
  deliveryConditions: z.string().trim(),
  cuisine: z.string().min(5, 'Укажите вашу кухню').trim()
})

export type CreateRestaurantFormValues = z.infer<typeof createRestaurantSchema>

export const validateCreateRestaurantForm = validateWithZod(
  createRestaurantSchema
)
