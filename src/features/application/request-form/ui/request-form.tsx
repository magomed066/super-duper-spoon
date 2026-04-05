import { useForm } from '@mantine/form'
import { Button, Stack, Text, TextInput } from '@mantine/core'
import {
  type ApplicationFormValues,
  useRequestClientMutation,
  validateApplicationForm
} from '@/entities/application'
import { PhoneInput } from '@/shared/ui/phone-input'

const initialValues: ApplicationFormValues = {
  email: '',
  name: '',
  restaurantName: '',
  address: '',
  phone: ''
}

type RequestFormProps = {
  onSuccess: () => void
}

export function RequestForm({ onSuccess }: RequestFormProps) {

  const form = useForm<ApplicationFormValues>({
    initialValues,
    validate: validateApplicationForm,
    validateInputOnBlur: true
  })

  const { mutateAsync, isPending } = useRequestClientMutation(() => {
    form.reset()
    onSuccess()
  })

  const canSubmit = Object.values(form.values).every(
    (value) => value.trim().length > 0
  )

  const handleSubmit = (data: ApplicationFormValues) => {
    mutateAsync(data)
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="lg">
        <TextInput
          label="Email"
          placeholder="owner@restaurant.com"
          size="md"
          radius="md"
          {...form.getInputProps('email')}
        />

        <TextInput
          label="Ваше имя"
          placeholder="Анна Петрова"
          size="md"
          radius="md"
          {...form.getInputProps('name')}
        />

        <TextInput
          label="Название бизнеса"
          placeholder="Basilico Bistro"
          size="md"
          radius="md"
          {...form.getInputProps('restaurantName')}
        />

        <TextInput
          label="Адрес"
          placeholder="Москва, ул. Лесная, 12"
          size="md"
          radius="md"
          {...form.getInputProps('address')}
        />

        <PhoneInput
          label="Телефон"
          placeholder="+7 (999) 123-45-67"
          size="md"
          radius="md"
          {...form.getInputProps('phone')}
        />

        <Button
          color="aurora"
          size="md"
          radius="md"
          type="submit"
          fullWidth
          disabled={!canSubmit}
          loading={isPending}
        >
          Отправить заявку
        </Button>

        <Text size="sm" c="dimmed">
          Оставляя заявку, вы подтверждаете, что мы можем связаться с вами для
          обсуждения подключения, демо и условий сотрудничества.
        </Text>
      </Stack>
    </form>
  )
}
