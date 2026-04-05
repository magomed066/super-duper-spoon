import { z } from 'zod'
import { validateWithZod } from '@/entities/auth'

export const applicationSchema = z.object({
  email: z.email('Введите корректный email'),
  name: z.string().min(2, 'Введите имя'),
  restaurantName: z
    .string()
    .min(2, 'Введите название ресторана или компании'),
  address: z.string().min(5, 'Введите адрес'),
  phone: z
    .string()
    .regex(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/, 'Введите номер в формате +7 (999) 123-45-67')
})

export type ApplicationFormValues = z.infer<typeof applicationSchema>

export const validateApplicationForm = validateWithZod(applicationSchema)
