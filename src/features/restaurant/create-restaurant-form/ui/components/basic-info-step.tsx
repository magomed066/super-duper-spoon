import type { UseFormReturnType } from '@mantine/form'
import { Stack, TextInput, Textarea } from '@mantine/core'
import type { CreateRestaurantFormValues } from '@/entities/restaurant'
import { PhoneInput } from '@/shared/ui/phone-input'
import {
  FORM_FIELD_CLASSNAMES,
  FORM_FIELD_WITH_DESCRIPTION_CLASSNAMES
} from './form-field-styles'

type BasicInfoStepProps = {
  form: UseFormReturnType<CreateRestaurantFormValues>
}

export function BasicInfoStep({ form }: BasicInfoStepProps) {
  return (
    <Stack gap="lg">
      <TextInput
        required
        label="Название бизнеса"
        placeholder="Basilico Bistro"
        radius="md"
        classNames={FORM_FIELD_CLASSNAMES}
        {...form.getInputProps('name')}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <PhoneInput
          required
          label="Телефон"
          placeholder="+7 (999) 123-45-67"
          radius="md"
          classNames={FORM_FIELD_CLASSNAMES}
          {...form.getInputProps('phone')}
        />

        <TextInput
          required
          label="Email"
          placeholder="owner@restaurant.com"
          radius="md"
          classNames={FORM_FIELD_CLASSNAMES}
          {...form.getInputProps('email')}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput
          required
          label="Город"
          placeholder="Москва"
          radius="md"
          classNames={FORM_FIELD_CLASSNAMES}
          {...form.getInputProps('city')}
        />

        <TextInput
          required
          label="Кухня"
          placeholder="Итальянская, Пицца, Завтраки"
          radius="md"
          classNames={FORM_FIELD_WITH_DESCRIPTION_CLASSNAMES}
          {...form.getInputProps('cuisine')}
        />
      </div>

      <TextInput
        required
        label="Адрес"
        placeholder="Москва, ул. Лесная, 12"
        radius="md"
        classNames={FORM_FIELD_CLASSNAMES}
        {...form.getInputProps('address')}
      />

      <Textarea
        required
        label="Описание"
        placeholder="Кратко опишите концепцию ресторана, меню и особенности сервиса."
        minRows={4}
        autosize
        radius="md"
        classNames={FORM_FIELD_CLASSNAMES}
        {...form.getInputProps('description')}
      />
    </Stack>
  )
}
