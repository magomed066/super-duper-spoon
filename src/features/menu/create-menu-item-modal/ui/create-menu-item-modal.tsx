import { useState } from 'react'
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
  Text,
  TextInput,
  Textarea
} from '@mantine/core'
import { useForm } from '@mantine/form'
import type { Category } from '@/entities/category'
import {
  createMenuItemSchema,
  initialCreateMenuItemValues,
  type CreateMenuItemFormValues,
  useCreateMenuItemMutation,
  validateCreateMenuItemForm
} from '@/entities/menu'
import { resolveMediaUrl } from '@/shared/lib/helpers/media'
import { TbPhotoPlus, TbTrash } from 'react-icons/tb'

type Props = {
  opened: boolean
  onClose: () => void
  restaurantId: string
  categoryId?: string
  categories?: Category[]
}

export function CreateMenuItemModal({
  opened,
  onClose,
  restaurantId,
  categoryId,
  categories
}: Props) {
  const form = useForm<CreateMenuItemFormValues>({
    initialValues: initialCreateMenuItemValues,
    validate: validateCreateMenuItemForm,
    validateInputOnBlur: true
  })
  const [selectedCategoryId, setSelectedCategoryId] = useState(categoryId ?? '')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState('')

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
  const canSubmit =
    createMenuItemSchema.safeParse(form.values).success &&
    Boolean(selectedCategoryId)

  const handleSubmit = (values: CreateMenuItemFormValues) => {
    mutate({
      categoryId: selectedCategoryId,
      name: values.name.trim(),
      description: values.description.trim() || undefined,
      price: values.price,
      imageFile: imageFile ?? undefined
    })
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
      title="Добавить блюдо"
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
            <Button type="submit" loading={isPending} disabled={!canSubmit}>
              Добавить
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
