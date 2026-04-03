import { useState } from 'react'
import { useForm } from '@mantine/form'
import {
  Anchor,
  Button,
  Checkbox,
  Group,
  PasswordInput,
  Stack,
  Text,
  TextInput
} from '@mantine/core'
import { signInSchema, validateWithZod } from '@/entities/auth'
import { useLoginMutation } from '@/entities/auth/model/hooks'
import type { UserLogin } from '@/shared/api/services/auth/types'

export function SignInForm() {
  const [rememberMe, setRememberMe] = useState(true)

  const { mutate, isPending } = useLoginMutation()

  const form = useForm<UserLogin>({
    initialValues: {
      email: '',
      password: ''
    },
    validate: validateWithZod(signInSchema),
    validateInputOnBlur: true
  })

  const canSubmit =
    form.values.email.trim().length > 0 &&
    form.values.password.trim().length > 0

  const handleSubmit = (data: UserLogin) => mutate(data)

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="lg">
        <TextInput
          label="Email"
          placeholder="you@example.com"
          size="md"
          radius="md"
          {...form.getInputProps('email')}
        />

        <PasswordInput
          label="Пароль"
          placeholder="Введите пароль"
          size="md"
          radius="md"
          {...form.getInputProps('password')}
        />

        <Group justify="space-between" align="center" gap="md">
          <Checkbox
            label="Запомнить меня"
            color="aurora"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.currentTarget.checked)}
          />

          <Anchor href="#" size="sm" c="aurora.6">
            Забыли пароль?
          </Anchor>
        </Group>

        <Button
          color="aurora"
          size="md"
          radius="md"
          type="submit"
          fullWidth
          disabled={!canSubmit}
          loading={isPending}
        >
          Войти в кабинет
        </Button>

        <Text size="sm" c="dimmed">
          Продолжая, вы соглашаетесь с условиями сервиса и политикой обработки
          данных.
        </Text>
      </Stack>
    </form>
  )
}
