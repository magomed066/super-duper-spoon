import { useForm } from '@mantine/form'
import { Button, PasswordInput, Stack, Text, TextInput } from '@mantine/core'
import {
  signUpSchema,
  type SignUpFormValues,
  validateWithZod
} from '@/entities/auth'
import { useRegisterMutation } from '@/entities/auth/model/hooks'

export function SignUpForm() {
  const form = useForm<SignUpFormValues>({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: ''
    },
    validate: validateWithZod(signUpSchema),
    validateInputOnBlur: true
  })

  const { mutate } = useRegisterMutation()

  const canSubmit =
    form.values.firstName.trim().length > 0 &&
    form.values.lastName.trim().length > 0 &&
    form.values.email.trim().length > 0 &&
    form.values.password.trim().length > 0 &&
    form.values.confirmPassword.trim().length > 0

  const handleSubmit = (data: SignUpFormValues) => {
    const { confirmPassword: _confirmPassword, ...restData } = data
    mutate(restData)
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="lg">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            label="Имя"
            placeholder="Анна"
            size="md"
            radius="md"
            {...form.getInputProps('firstName')}
          />

          <TextInput
            label="Фамилия"
            placeholder="Иванова"
            size="md"
            radius="md"
            {...form.getInputProps('lastName')}
          />
        </div>

        <TextInput
          label="Email"
          placeholder="you@example.com"
          size="md"
          radius="md"
          {...form.getInputProps('email')}
        />
        <TextInput
          label="Телефон"
          placeholder="you@example.com"
          size="md"
          radius="md"
          {...form.getInputProps('phone')}
        />

        <PasswordInput
          label="Пароль"
          placeholder="Придумайте пароль"
          size="md"
          radius="md"
          {...form.getInputProps('password')}
        />

        <PasswordInput
          label="Подтверждение пароля"
          placeholder="Повторите пароль"
          size="md"
          radius="md"
          {...form.getInputProps('confirmPassword')}
        />

        <Button
          color="coral"
          size="md"
          radius="md"
          type="submit"
          fullWidth
          disabled={!canSubmit}
        >
          Создать аккаунт
        </Button>

        <Text size="sm" c="dimmed">
          После регистрации вы сможете отслеживать заявки, платежи и документы в
          личном кабинете.
        </Text>
      </Stack>
    </form>
  )
}
