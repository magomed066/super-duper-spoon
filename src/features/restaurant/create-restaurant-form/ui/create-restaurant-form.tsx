import { useForm } from '@mantine/form'
import {
  Box,
  Button,
  Divider,
  NumberInput,
  Stack,
  Text,
  TextInput,
  Textarea
} from '@mantine/core'
import { PhoneInput } from '@/shared/ui/phone-input'
import {
  useCreateRestaurantMutation,
  validateCreateRestaurantForm,
  type CreateRestaurantFormValues
} from '@/entities/restaurant'

import { UploadLogoPreviewFeature } from './upload-logo/upload-logo-preview'

const initialValues: CreateRestaurantFormValues = {
  name: '',
  phone: '',
  address: '',
  description: '',
  email: '',
  city: '',
  deliveryTime: 0,
  deliveryConditions: '',
  cuisine: ''
}

export function CreateRestaurantForm() {
  const form = useForm<CreateRestaurantFormValues>({
    initialValues,
    validate: validateCreateRestaurantForm,
    validateInputOnBlur: true
  })

  const { mutate, isPending } = useCreateRestaurantMutation(() => {
    form.reset()
  })

  const canSubmit =
    form.values.name.trim().length > 0 &&
    form.values.phone.trim().length > 0 &&
    form.values.address.trim().length > 0 &&
    form.values.description.trim().length > 0

  const handleSubmit = (data: CreateRestaurantFormValues) => {
    mutate({
      ...data,
      email: data.email.trim() || undefined,
      city: data.city.trim() || undefined,
      deliveryTime: data.deliveryTime ?? undefined,
      deliveryConditions: data.deliveryConditions.trim() || undefined,
      cuisine: data.cuisine
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    })
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="lg">
        <TextInput
          required
          label="Название бизнеса"
          placeholder="Basilico Bistro"
          size="md"
          radius="md"
          classNames={{
            input:
              'border-black/10 bg-[#fcfbf8] text-moss-900 placeholder:text-[#9b9387]',
            label: 'mb-2 text-sm font-medium text-moss-900'
          }}
          {...form.getInputProps('name')}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <PhoneInput
            required
            label="Телефон"
            placeholder="+7 (999) 123-45-67"
            size="md"
            radius="md"
            classNames={{
              input:
                'border-black/10 bg-[#fcfbf8] text-moss-900 placeholder:text-[#9b9387]',
              label: 'mb-2 text-sm font-medium text-moss-900'
            }}
            {...form.getInputProps('phone')}
          />

          <TextInput
            label="Email"
            placeholder="owner@restaurant.com"
            size="md"
            radius="md"
            classNames={{
              input:
                'border-black/10 bg-[#fcfbf8] text-moss-900 placeholder:text-[#9b9387]',
              label: 'mb-2 text-sm font-medium text-moss-900'
            }}
            {...form.getInputProps('email')}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            label="Город"
            placeholder="Москва"
            size="md"
            radius="md"
            classNames={{
              input:
                'border-black/10 bg-[#fcfbf8] text-moss-900 placeholder:text-[#9b9387]',
              label: 'mb-2 text-sm font-medium text-moss-900'
            }}
            {...form.getInputProps('city')}
          />

          <NumberInput
            label="Время доставки, мин"
            placeholder="45"
            size="md"
            radius="md"
            min={0}
            allowDecimal={false}
            hideControls
            classNames={{
              input:
                'border-black/10 bg-[#fcfbf8] text-moss-900 placeholder:text-[#9b9387]',
              label: 'mb-2 text-sm font-medium text-moss-900'
            }}
            {...form.getInputProps('deliveryTime')}
          />
        </div>

        <TextInput
          required
          label="Адрес"
          placeholder="Москва, ул. Лесная, 12"
          size="md"
          radius="md"
          classNames={{
            input:
              'border-black/10 bg-[#fcfbf8] text-moss-900 placeholder:text-[#9b9387]',
            label: 'mb-2 text-sm font-medium text-moss-900'
          }}
          {...form.getInputProps('address')}
        />

        <TextInput
          label="Кухня"
          placeholder="Итальянская, Пицца, Завтраки"
          size="md"
          radius="md"
          description="Перечислите направления через запятую."
          classNames={{
            input:
              'border-black/10 bg-[#fcfbf8] text-moss-900 placeholder:text-[#9b9387]',
            label: 'mb-2 text-sm font-medium text-moss-900',
            description: 'mt-2 text-xs leading-5 text-moss-600'
          }}
          {...form.getInputProps('cuisine')}
        />

        <Textarea
          required
          label="Описание"
          placeholder="Кратко опишите концепцию ресторана, меню и особенности сервиса."
          minRows={4}
          autosize
          radius="md"
          classNames={{
            input:
              'border-black/10 bg-[#fcfbf8] text-moss-900 placeholder:text-[#9b9387]',
            label: 'mb-2 text-sm font-medium text-moss-900'
          }}
          {...form.getInputProps('description')}
        />

        <Textarea
          label="Условия доставки"
          placeholder="Бесплатная доставка от 1500 ₽, зона доставки до 5 км."
          minRows={3}
          autosize
          radius="md"
          classNames={{
            input:
              'border-black/10 bg-[#fcfbf8] text-moss-900 placeholder:text-[#9b9387]',
            label: 'mb-2 text-sm font-medium text-moss-900'
          }}
          {...form.getInputProps('deliveryConditions')}
        />

        <Box my={24}>
          <UploadLogoPreviewFeature required isLoading={isPending} />
          <Divider className="border-black/8" mt="0" />
        </Box>

        <Button
          type="submit"
          size="md"
          radius="md"
          loading={isPending}
          disabled={!canSubmit}
          className="mt-2"
        >
          Создать ресторан
        </Button>

        <Text size="sm" className="leading-6 text-moss-700">
          После создания ресторан появится в общем списке и будет привязан к
          вашей учетной записи как к владельцу.
        </Text>
      </Stack>
    </form>
  )
}
