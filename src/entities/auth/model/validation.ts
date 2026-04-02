import type { FormErrors } from '@mantine/form'
import { z } from 'zod'

export const signInSchema = z.object({
  email: z.email('Введите корректный email'),
  password: z
    .string()
    .min(6, 'Пароль должен содержать минимум 6 символов')
})

export const signUpSchema = z
  .object({
    firstName: z
      .string()
      .min(2, 'Имя должно содержать минимум 2 символа'),
    lastName: z
      .string()
      .min(2, 'Фамилия должна содержать минимум 2 символа'),
    email: z.email('Введите корректный email'),
    password: z
      .string()
      .min(8, 'Пароль должен содержать минимум 8 символов'),
    confirmPassword: z.string().min(8, 'Подтвердите пароль')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword']
  })

export function getFieldErrors<T extends Record<string, unknown>>(
  result: z.ZodError<T>
): FormErrors {
  const flattened = result.flatten().fieldErrors

  return Object.fromEntries(
    Object.entries(flattened).map(([key, value]) => [key, value?.[0]])
  )
}

export function validateWithZod<T extends Record<string, unknown>>(
  schema: z.ZodType<T, T>
): (values: T) => FormErrors {
  return (values: T): FormErrors => {
    const result = schema.safeParse(values)

    if (result.success) {
      return {}
    }

    return getFieldErrors(result.error)
  }
}
