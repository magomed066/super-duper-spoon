import type { CreateRestaurantFormValues } from '@/entities/restaurant'
import { declineMinuteTitle } from '@/entities/restaurant/model/utils'
import { Box, Flex, InputError, InputLabel, Slider, Text } from '@mantine/core'
import type { UseFormReturnType } from '@mantine/form'

type Props = {
  form: UseFormReturnType<CreateRestaurantFormValues>
}

export function DeliveryTime(props: Props) {
  const { form } = props

  const time = form.getValues().deliveryTime

  return (
    <Box>
      <Flex direction="column" gap={8}>
        <InputLabel
          required
          size="md"
          className="leading-[32p] text-3xl font-bold text-moss-900"
        >
          Время доставки — {declineMinuteTitle(time)}
        </InputLabel>
        <Text size="sm" className="text-moss-700">
          Выберите время, за которое будете успевать приготовить и доставить
          заказ клиенту
        </Text>
      </Flex>

      <Slider
        mt={32}
        color="aurora"
        marks={[
          { value: 30, label: '30 минут' },
          { value: 60, label: '60 минут' },
          { value: 90, label: '90 минут' },
          { value: 120, label: '120 минут' },
          { value: 150, label: '150 минут' }
        ]}
        defaultValue={50}
        max={170}
        value={Number(form.getValues().deliveryTime)}
        onChange={(value) => form.setFieldValue('deliveryTime', String(value))}
      />

      <InputError>{form.errors.deliveryTime}</InputError>
    </Box>
  )
}
