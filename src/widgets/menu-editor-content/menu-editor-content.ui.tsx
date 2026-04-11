import { Box, Divider, Group, Paper, Stack, Text, Title } from '@mantine/core'
import { useCategoriesQuery } from '@/entities/category'
import {
  MenuContentCard,
  MenuEditorEmptyState,
  MENU_EDITOR_SECTIONS,
  type MenuEditorContentProps
} from '@/entities/menu'
// import { useRestaurantQuery } from '@/entities/restaurant'
import { useMenuNavigation } from '@/features/menu/navigation'

export function MenuEditorContent(_: MenuEditorContentProps) {
  const { restaurantId, selectedSectionId, selectedCategoryId } =
    useMenuNavigation()
  // const { data: restaurant } = useRestaurantQuery(
  //   restaurantId,
  //   Boolean(restaurantId)
  // )

  const { data: categories } = useCategoriesQuery(
    restaurantId,
    Boolean(restaurantId)
  )

  const selectedSection =
    MENU_EDITOR_SECTIONS.find((item) => item.id === selectedSectionId) ??
    MENU_EDITOR_SECTIONS[0]
  const selectedCategory = categories?.find(
    (item) => item.id === selectedCategoryId
  )

  return (
    <Paper withBorder radius="lg" className="min-h-140 flex-1 bg-white">
      <Box p={32}>
        {!restaurantId ? (
          <MenuEditorEmptyState />
        ) : (
          <Stack gap="xl">
            <Stack gap={8}>
              <Group gap="sm">
                <Title order={2} className="text-moss-900">
                  {selectedCategory?.name ?? selectedSection.title}
                </Title>
              </Group>

              <Text maw={760} className="leading-7 text-moss-700">
                {selectedCategory
                  ? selectedCategory.description?.trim() ||
                    'Описание категории пока не заполнено. Здесь можно подготовить рабочую область для наполнения блюд и контроля состава.'
                  : selectedSection.description}
              </Text>
            </Stack>

            <Divider color="rgba(0,0,0,0.08)" />

            {selectedCategory ? (
              <MenuContentCard
                title="Категория выбрана для редактирования"
                description="Следующий шаг: подключить список блюд, фильтрацию по категории и формы редактирования позиций. Базовая навигация для сценария уже готова."
              />
            ) : null}
          </Stack>
        )}
      </Box>
    </Paper>
  )
}
