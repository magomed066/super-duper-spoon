import { useEffect } from 'react'
import { useForm } from '@mantine/form'
import {
  Button,
  Group,
  Modal,
  Stack,
  Switch,
  Textarea,
  TextInput
} from '@mantine/core'
import {
  editCategorySchema,
  type EditCategoryFormValues,
  useUpdateCategoryMutation,
  validateEditCategoryForm,
  getEditCategoryInitialValues
} from '@/entities/category'
import type { Props } from './types'

export function EditCategoryModal(props: Props) {
  const { opened, onClose, restaurantId, category } = props

  const form = useForm<EditCategoryFormValues>({
    initialValues: getEditCategoryInitialValues(category),
    validate: validateEditCategoryForm,
    validateInputOnBlur: true
  })

  useEffect(() => {
    const values = getEditCategoryInitialValues(category)
    form.setValues(values)
    form.resetDirty(values)
  }, [category, opened]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleClose = () => {
    form.reset()
    onClose()
  }

  const updateMutation = useUpdateCategoryMutation(
    restaurantId,
    category.id,
    handleClose
  )

  const canSubmit = editCategorySchema.safeParse(form.values).success

  const handleSubmit = (values: EditCategoryFormValues) => {
    updateMutation.mutate({
      name: values.name.trim(),
      description: values.description.trim() || undefined,
      isActive: values.isActive
    })
  }

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Редактировать категорию"
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
          <Switch
            label="Категория активна"
            {...form.getInputProps('isActive', { type: 'checkbox' })}
          />

          <Group justify="flex-end" pt="sm">
            <Button variant="default" onClick={handleClose}>
              Отмена
            </Button>
            <Button
              type="submit"
              loading={updateMutation.isPending}
              disabled={!canSubmit}
            >
              Сохранить
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
