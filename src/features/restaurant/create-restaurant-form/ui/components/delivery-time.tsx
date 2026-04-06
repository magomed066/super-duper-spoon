import type { CreateRestaurantFormValues } from '@/entities/restaurant'
import { declineMinuteTitle } from '@/entities/restaurant/model/utils'
import { Box, Flex, InputLabel, Text, TextInput } from '@mantine/core'
import type { UseFormReturnType } from '@mantine/form'
import { FORM_FIELD_CLASSNAMES } from './form-field-styles'

type Props = {
  form: UseFormReturnType<CreateRestaurantFormValues>
}

export function DeliveryTime(props: Props) {
  const { form } = props

  const rawTime = Number(form.values.deliveryTime)
  const time = Number.isFinite(rawTime) && rawTime > 0 ? rawTime : 50

  return (
    <Box className="w-full flex flex-col">
      <Flex direction="column" gap={8}>
        <InputLabel
          required
          size="md"
          className="leading-8 text-3xl font-bold text-moss-900"
        >
          Время доставки — {declineMinuteTitle(time)}
        </InputLabel>
        <Text size="sm" className="text-moss-700">
          Выберите время, за которое будете успевать приготовить и доставить
          заказ клиенту
        </Text>
      </Flex>

      <TextInput
        required
        mt="xl"
        type="number"
        min={0}
        step={5}
        placeholder="45"
        value={form.values.deliveryTime}
        onChange={(event) =>
          form.setFieldValue('deliveryTime', event.currentTarget.value)
        }
        error={form.errors.deliveryTime}
        rightSection={<Text size="xs" className="pr-3 text-moss-500">мин</Text>}
        classNames={FORM_FIELD_CLASSNAMES}
      />
    </Box>
  )
}
