import { useForm } from '@mantine/form'
import { Button, Stack, Text, TextInput } from '@mantine/core'
import {
  type ApplicationFormValues,
  useRequestClientMutation,
  validateApplicationForm
} from '@/entities/application'
import { PhoneInput } from '@/shared/ui/phone-input'
import { useNavigate } from 'react-router'
import { ROUTES } from '@/shared/config/routes'

export const initialValues: ApplicationFormValues = {
  email: '',
  name: '',
  restaurantName: '',
  address: '',
  phone: ''
}

export function RequestForm() {
  const navigate = useNavigate()

  const form = useForm<ApplicationFormValues>({
    initialValues,
    validate: validateApplicationForm,
    validateInputOnBlur: true
  })

  const { mutateAsync, isPending } = useRequestClientMutation(() => {
    form.reset()
    navigate(ROUTES.REQUEST_SUCCESS)
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
          classNames={{
            input:
              'border-black/10 bg-[#fcfbf8] text-moss-900 placeholder:text-[#9b9387]',
            label: 'mb-2 text-sm font-medium text-moss-900'
          }}
          {...form.getInputProps('email')}
        />

        <TextInput
          label="Ваше имя"
          placeholder="Анна Петрова"
          size="md"
          classNames={{
            input:
              'border-black/10 bg-[#fcfbf8] text-moss-900 placeholder:text-[#9b9387]',
            label: 'mb-2 text-sm font-medium text-moss-900 '
          }}
          {...form.getInputProps('name')}
        />

        <TextInput
          label="Название бизнеса"
          placeholder="Basilico Bistro"
          size="md"
          classNames={{
            input:
              'border-black/10 bg-[#fcfbf8] text-moss-900 placeholder:text-[#9b9387]',
            label: 'mb-2 text-sm font-medium text-moss-900'
          }}
          {...form.getInputProps('restaurantName')}
        />

        <TextInput
          label="Адрес"
          placeholder="Москва, ул. Лесная, 12"
          size="md"
          classNames={{
            input:
              'border-black/10 bg-[#fcfbf8] text-moss-900 placeholder:text-[#9b9387]',
            label: 'mb-2 text-sm font-medium ttext-moss-900'
          }}
          {...form.getInputProps('address')}
        />

        <PhoneInput
          label="Телефон"
          placeholder="+7 (999) 123-45-67"
          size="md"
          classNames={{
            input:
              'border-black/10 bg-[#fcfbf8] text-moss-900 placeholder:text-[#9b9387]',
            label: 'mb-2 text-sm font-medium text-moss-900'
          }}
          {...form.getInputProps('phone')}
        />

        <Button
          size="md"
          type="submit"
          fullWidth
          disabled={!canSubmit}
          loading={isPending}
        >
          Отправить заявку
        </Button>

        <Text size="sm" className="leading-6 text-moss-700">
          Оставляя заявку, вы подтверждаете, что мы можем связаться с вами для
          обсуждения подключения, демо и условий сотрудничества.
        </Text>
      </Stack>
    </form>
  )
}
