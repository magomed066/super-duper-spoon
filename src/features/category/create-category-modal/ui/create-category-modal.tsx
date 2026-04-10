import { useForm } from '@mantine/form'
import {
  Button,
  Group,
  Modal,
  NumberInput,
  Stack,
  Textarea,
  TextInput
} from '@mantine/core'
import {
  createCategorySchema,
  type CreateCategoryFormValues,
  useCreateCategoryMutation,
  validateCreateCategoryForm
} from '@/entities/category'

type Props = {
  opened: boolean
  onClose: () => void
  restaurantId: string
}

const initialValues: CreateCategoryFormValues = {
  name: '',
  description: '',
  sortOrder: '0'
}

export function CreateCategoryModal({ opened, onClose, restaurantId }: Props) {
  const form = useForm<CreateCategoryFormValues>({
    initialValues,
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
      description: values.description.trim() || undefined,
      sortOrder: Number(values.sortOrder)
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

          <NumberInput
            label="Порядок сортировки"
            placeholder="0"
            min={0}
            allowNegative={false}
            clampBehavior="strict"
            {...form.getInputProps('sortOrder')}
          />

          <Group justify="flex-end" pt="sm">
            <Button variant="default" onClick={onClose}>
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
