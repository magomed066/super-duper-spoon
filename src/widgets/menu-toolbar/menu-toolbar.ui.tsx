import SelectRestaurantFeature from '@/features/restaurant/select-restaurant'
import { Button, Flex } from '@mantine/core'
import { TbCopy } from 'react-icons/tb'

export function MenuToolbarWidget() {
  return (
    <Flex
      direction={{ base: 'column', sm: 'row' }}
      align={{ base: 'stretch', sm: 'flex-end' }}
      gap="md"
    >
      <SelectRestaurantFeature />

      <Button
        leftSection={<TbCopy size={18} />}
        variant="filled"
        color="dark"
        h={36}
        radius="xl"
        disabled
      >
        Скопировать меню
      </Button>
    </Flex>
  )
}
