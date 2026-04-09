import type { UseFormReturnType } from '@mantine/form'
import {
  Checkbox,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
  Textarea
} from '@mantine/core'
import type { CreateRestaurantFormValues } from '@/entities/restaurant'
import { WEEK_DAYS } from './constants'
import { FORM_FIELD_CLASSNAMES } from './form-field-styles'
import { DeliveryTime } from './delivery-time'

type DeliveryScheduleStepProps = {
  required?: boolean
  form: UseFormReturnType<CreateRestaurantFormValues>
}

export function DeliveryScheduleStep({
  form,
  required
}: DeliveryScheduleStepProps) {
  return (
    <Stack gap="lg">
      <DeliveryTime form={form} required={required} />

      <Textarea
        required={required}
        label="Условия доставки"
        placeholder="Бесплатная доставка от 1500 ₽, зона доставки до 5 км."
        minRows={3}
        autosize
        classNames={FORM_FIELD_CLASSNAMES}
        {...form.getInputProps('deliveryConditions')}
      />

      <div>
        <Group justify="space-between" align="center" mb="sm">
          <div>
            <Text size="sm" fw={600} className="text-moss-900">
              Расписание кухни
            </Text>
            <Text size="sm" className="mt-1 leading-5 text-moss-700">
              Отметьте рабочие дни и задайте интервал, когда доступны заказы.
            </Text>
          </div>
        </Group>

        <Stack gap="sm">
          {WEEK_DAYS.map((item, index) => (
            <Paper
              key={item.day}
              radius="md"
              p="sm"
              className="border border-black/8"
            >
              <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_160px_160px] md:items-center">
                <Checkbox
                  label={item.label}
                  color="aurora"
                  checked={form.values.workSchedule?.[index]?.enabled}
                  onChange={(event) =>
                    form.setFieldValue(
                      `workSchedule.${index}.enabled`,
                      event.currentTarget.checked
                    )
                  }
                />

                <TextInput
                  type="time"
                  label="Открытие"
                  radius="md"
                  disabled={!form.values.workSchedule?.[index]?.enabled}
                  classNames={{
                    input:
                      'border-black/10 bg-white text-moss-900 disabled:bg-moss-100',
                    label: 'mb-2 text-sm font-medium text-moss-900'
                  }}
                  {...form.getInputProps(`workSchedule.${index}.open`)}
                />

                <TextInput
                  type="time"
                  label="Закрытие"
                  radius="md"
                  disabled={!form.values.workSchedule?.[index]?.enabled}
                  classNames={{
                    input:
                      'border-black/10 bg-white text-moss-900 disabled:bg-moss-100',
                    label: 'mb-2 text-sm font-medium text-moss-900'
                  }}
                  {...form.getInputProps(`workSchedule.${index}.close`)}
                />
              </div>
            </Paper>
          ))}
        </Stack>

        {typeof form.errors.workSchedule === 'string' && (
          <Text size="sm" c="red" mt="sm">
            {form.errors.workSchedule}
          </Text>
        )}
      </div>
    </Stack>
  )
}
