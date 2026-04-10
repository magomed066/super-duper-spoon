import { useEffect } from 'react'
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
  type Category,
  type CreateCategoryFormValues,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  validateCreateCategoryForm
} from '@/entities/category'

type Props = {
  opened: boolean
  onClose: () => void
  restaurantId: string
  category?: Category
}

const getInitialValues = (category?: Category): CreateCategoryFormValues => ({
  name: category?.name ?? '',
  description: category?.description ?? '',
  sortOrder: String(category?.sortOrder ?? 0)
})

export function CategoryModal({
  opened,
  onClose,
  restaurantId,
  category
}: Props) {
  const form = useForm<CreateCategoryFormValues>({
    initialValues: getInitialValues(category),
    validate: validateCreateCategoryForm,
    validateInputOnBlur: true
  })

  useEffect(() => {
    form.setValues(getInitialValues(category))
    form.resetDirty(getInitialValues(category))
  }, [category, opened]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleClose = () => {
    form.reset()
    onClose()
  }

  const createMutation = useCreateCategoryMutation(restaurantId, handleClose)
  const updateMutation = useUpdateCategoryMutation(
    restaurantId,
    category?.id ?? '',
    handleClose
  )

  const isEditMode = Boolean(category)
  const isPending = isEditMode
    ? updateMutation.isPending
    : createMutation.isPending
  const canSubmit = createCategorySchema.safeParse(form.values).success

  const handleSubmit = (values: CreateCategoryFormValues) => {
    const payload = {
      name: values.name.trim(),
      description: values.description.trim() || undefined,
      sortOrder: Number(values.sortOrder)
    }

    if (isEditMode && category) {
      updateMutation.mutate({
        ...payload,
        isActive: category.isActive
      })
      return
    }

    createMutation.mutate(payload)
  }

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={isEditMode ? 'Редактировать категорию' : 'Создать категорию'}
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
            <Button variant="default" onClick={handleClose}>
              Отмена
            </Button>
            <Button type="submit" loading={isPending} disabled={!canSubmit}>
              {isEditMode ? 'Сохранить' : 'Создать'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
