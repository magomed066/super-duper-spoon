import {
  Alert,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  Tooltip
} from '@mantine/core'
import { useCategoriesQuery } from '@/entities/category'
import {
  MENU_EDITOR_SECTIONS,
  MenuSidebarItem,
  MenuSidebarItemSkeleton,
  type MenuEditorSidebarProps
} from '@/entities/menu'
import { useMenuNavigation } from '@/features/menu/navigation'
import { TbAlertCircle, TbInfoCircle } from 'react-icons/tb'

export function MenuEditorSidebarWidget(_: MenuEditorSidebarProps) {
  const {
    restaurantId,
    selectedSectionId,
    selectedCategoryId,
    handleSectionSelect,
    handleCategorySelect
  } = useMenuNavigation()

  const {
    data: categories,
    error,
    isError,
    isLoading
  } = useCategoriesQuery(restaurantId, Boolean(restaurantId))

  const activeCategoriesCount =
    categories?.filter((item) => item.isActive).length ?? 0

  return (
    <Paper
      withBorder
      radius="lg"
      p={24}
      miw={{ lg: 340 }}
      maw={{ lg: 380 }}
      w="100%"
      className="bg-white"
    >
      <Stack gap="lg">
        <div>
          <Group gap={8} align="center">
            <Text fw={700} className="text-lg text-moss-900">
              Редактирование
            </Text>
            <Tooltip label="Сначала настройте категории, затем переходите к наполнению блюд и добавок.">
              <span className="inline-flex">
                <TbInfoCircle size={16} className="text-moss-500" />
              </span>
            </Tooltip>
          </Group>
        </div>

        <Stack gap={8}>
          {MENU_EDITOR_SECTIONS.map((item) => (
            <MenuSidebarItem
              key={item.id}
              title={item.title}
              description={item.description}
              active={
                !item.disabled &&
                selectedSectionId === item.id &&
                !selectedCategoryId
              }
              disabled={item.disabled}
              onClick={() => handleSectionSelect(item.id)}
            />
          ))}
        </Stack>

        <Divider color="rgba(0,0,0,0.08)" />

        <div>
          <Text fw={700} className="text-lg text-moss-900">
            Активные категории
          </Text>
          <Text size="sm" className="mt-2 text-moss-700">
            {activeCategoriesCount} категорий доступны для наполнения меню.
          </Text>
        </div>

        {!restaurantId ? (
          <Text size="sm" className="text-moss-600">
            Выберите ресторан, чтобы увидеть его категории.
          </Text>
        ) : isLoading ? (
          <MenuSidebarItemSkeleton count={5} />
        ) : isError ? (
          <Alert
            color="coral"
            radius="md"
            title="Не удалось загрузить категории"
            icon={<TbAlertCircle size={18} />}
          >
            {error?.message}
          </Alert>
        ) : categories?.length ? (
          <Stack gap={8}>
            {categories.map((item) => (
              <MenuSidebarItem
                key={item.id}
                title={item.name}
                description={
                  item.isActive
                    ? 'Категория участвует в меню.'
                    : 'Категория скрыта и не попадёт в выдачу.'
                }
                active={selectedCategoryId === item.id}
                disabled={!item.isActive}
                onClick={() => handleCategorySelect(item.id)}
              />
            ))}
          </Stack>
        ) : (
          <Paper withBorder radius="xl" p="md" className="bg-white">
            <Text size="sm" className="text-moss-600">
              Для выбранного ресторана пока нет категорий.
            </Text>
          </Paper>
        )}
      </Stack>
    </Paper>
  )
}
