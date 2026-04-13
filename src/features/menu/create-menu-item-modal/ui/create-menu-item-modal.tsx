import { useEffect, useState } from 'react'
import {
  AspectRatio,
  NumberInput,
  Button,
  FileButton,
  Group,
  Image,
  Modal,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
  Textarea
} from '@mantine/core'
import { useForm } from '@mantine/form'
import type { Category } from '@/entities/category'
import {
  createMenuItemSchema,
  editMenuItemSchema,
  getEditMenuItemInitialValues,
  initialCreateMenuItemValues,
  type CreateMenuItemFormValues,
  type EditMenuItemFormValues,
  useCreateMenuItemMutation,
  useUpdateMenuItemMutation,
  validateCreateMenuItemForm
} from '@/entities/menu'
import type { MenuItem } from '@/shared/api/services/menu-item/types'
import { resolveMediaUrl } from '@/shared/lib/helpers/media'
import { TbPhotoPlus, TbTrash } from 'react-icons/tb'

type Props = {
  opened: boolean
  onClose: () => void
  restaurantId: string
  categoryId?: string
  categories?: Category[]
  menuItem?: MenuItem
}

export function CreateMenuItemModal({
  opened,
  onClose,
  restaurantId,
  categoryId,
  categories,
  menuItem
}: Props) {
  const isEditMode = Boolean(menuItem)
  const form = useForm<CreateMenuItemFormValues & EditMenuItemFormValues>({
    initialValues: menuItem
      ? {
          ...getEditMenuItemInitialValues(menuItem)
        }
      : {
          ...initialCreateMenuItemValues,
          categoryId: categoryId ?? '',
          isActive: true
        },
    validate: validateCreateMenuItemForm,
    validateInputOnBlur: true
  })
  const [selectedCategoryId, setSelectedCategoryId] = useState(categoryId ?? '')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState('')

  useEffect(() => {
    if (!opened) {
      return
    }

    if (menuItem) {
      const initialValues = getEditMenuItemInitialValues(menuItem)
      form.setValues(initialValues)
      form.resetDirty(initialValues)
      setSelectedCategoryId(menuItem.categoryId)
      setImagePreviewUrl(resolveMediaUrl(menuItem.image))
      setImageFile(null)
      return
    }

    const initialValues = {
      ...initialCreateMenuItemValues,
      categoryId: categoryId ?? '',
      isActive: true
    }
    form.setValues(initialValues)
    form.resetDirty(initialValues)
    setSelectedCategoryId(categoryId ?? '')
    setImagePreviewUrl('')
    setImageFile(null)
  }, [opened, menuItem, categoryId]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleClose = () => {
    form.reset()
    setSelectedCategoryId(categoryId ?? '')
    setImageFile(null)
    setImagePreviewUrl('')
    onClose()
  }

  const { mutate, isPending } = useCreateMenuItemMutation(
    restaurantId,
    handleClose
  )
  const updateMutation = useUpdateMenuItemMutation(restaurantId, handleClose)
  const canSubmit =
    (isEditMode
      ? editMenuItemSchema.safeParse({
          ...form.values,
          categoryId: selectedCategoryId
        }).success
      : createMenuItemSchema.safeParse(form.values).success) &&
    Boolean(selectedCategoryId)

  const handleSubmit = (values: CreateMenuItemFormValues) => {
    const payload = {
      categoryId: selectedCategoryId,
      name: values.name.trim(),
      description: values.description.trim() || undefined,
      price: values.price,
      imageFile: imageFile ?? undefined,
      ...(isEditMode ? { isActive: form.values.isActive } : {})
    }

    if (menuItem) {
      updateMutation.mutate({
        itemId: menuItem.id,
        payload
      })
      return
    }

    mutate(payload)
  }

  const handleImageUpload = (file: File | null) => {
    if (!file) {
      return
    }

    setImageFile(file)
    setImagePreviewUrl(URL.createObjectURL(file))
  }

  const handleImageReset = () => {
    setImageFile(null)
    setImagePreviewUrl('')
  }

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={isEditMode ? 'Редактировать блюдо' : 'Добавить блюдо'}
      centered
      radius="lg"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          {!categoryId ? (
            <Select
              label="Категория"
              placeholder="Выберите категорию"
              data={
                categories
                  ?.filter((item) => item.isActive)
                  .map((item) => ({
                    value: item.id,
                    label: item.name
                  })) ?? []
              }
              value={selectedCategoryId}
              onChange={(value) => setSelectedCategoryId(value ?? '')}
              searchable
            />
          ) : null}

          <TextInput
            label="Название"
            placeholder="Например, Маргарита"
            {...form.getInputProps('name')}
          />

          <Textarea
            label="Описание"
            placeholder="Коротко опишите состав или подачу"
            minRows={3}
            autosize
            {...form.getInputProps('description')}
          />

          <NumberInput
            label="Цена"
            placeholder="450"
            min={1}
            step={10}
            allowDecimal={false}
            allowNegative={false}
            clampBehavior="strict"
            {...form.getInputProps('price')}
          />

          {isEditMode ? (
            <Switch
              label="Блюдо активно"
              {...form.getInputProps('isActive', { type: 'checkbox' })}
            />
          ) : null}

          <Stack gap="xs">
            <Text size="sm" fw={500}>
              Изображение
            </Text>

            {imagePreviewUrl ? (
              <AspectRatio ratio={16 / 9} maw={320}>
                <Image
                  src={resolveMediaUrl(imagePreviewUrl)}
                  alt="Предпросмотр блюда"
                  radius="md"
                />
              </AspectRatio>
            ) : (
              <Text size="sm" className="text-moss-600">
                Загрузите JPG, PNG, WEBP или SVG до 10 МБ.
              </Text>
            )}

            <Group>
              <FileButton
                onChange={handleImageUpload}
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
              >
                {({ onClick }) => (
                  <Button
                    variant="default"
                    // color="dark"
                    leftSection={<TbPhotoPlus size={16} />}
                    onClick={onClick}
                  >
                    {imagePreviewUrl ? 'Заменить фото' : 'Загрузить фото'}
                  </Button>
                )}
              </FileButton>

              {imagePreviewUrl ? (
                <Button
                  variant="subtle"
                  color="red"
                  leftSection={<TbTrash size={16} />}
                  onClick={handleImageReset}
                >
                  Убрать
                </Button>
              ) : null}
            </Group>
          </Stack>

          <Group justify="flex-end" pt="sm">
            <Button variant="default" onClick={handleClose}>
              Отмена
            </Button>
            <Button
              type="submit"
              loading={isEditMode ? updateMutation.isPending : isPending}
              disabled={!canSubmit}
            >
              {isEditMode ? 'Сохранить' : 'Добавить'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
