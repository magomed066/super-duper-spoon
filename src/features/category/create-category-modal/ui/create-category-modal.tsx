import { useForm } from '@mantine/form'
import {
  Button,
  Group,
  Modal,
  Stack,
  Textarea,
  TextInput
} from '@mantine/core'
import {
  createCategorySchema,
  type CreateCategoryFormValues,
  useCreateCategoryMutation,
  validateCreateCategoryForm,
  initialCreateCategoryValues
} from '@/entities/category'
import type { Props } from './types'

export function CreateCategoryModal(props: Props) {
  const { opened, onClose, restaurantId } = props

  const form = useForm<CreateCategoryFormValues>({
    initialValues: initialCreateCategoryValues,
    validate: validateCreateCategoryForm,
    validateInputOnBlur: true
  })

  const handleClose = () => {
    form.reset()
    onClose()
  }

  const { mutate, isPending } = useCreateCategoryMutation(
    restaurantId,
    handleClose
  )

  const canSubmit = createCategorySchema.safeParse(form.values).success

  const handleSubmit = (values: CreateCategoryFormValues) => {
    mutate({
      name: values.name.trim(),
      description: values.description.trim() || undefined
    })
  }

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Создать категорию"
      centered
      radius="lg"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Название"
            placeholder="Например, Пицца"
            {...form.getInputProps('name')}
          />

          <Textarea
            label="Описание"
            placeholder="Короткое описание категории"
            minRows={3}
            autosize
            {...form.getInputProps('description')}
          />
          <Group justify="flex-end" pt="sm">
            <Button variant="default" onClick={handleClose}>
              Отмена
            </Button>
            <Button type="submit" loading={isPending} disabled={!canSubmit}>
              Создать
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
