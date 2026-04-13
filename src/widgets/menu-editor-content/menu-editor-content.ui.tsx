import { MENU_SECTIONS, MenuEditorEmptyState } from '@/entities/menu'
import { CategoryManagement } from '@/features/category/category-management'
import { queryUrlConfig } from '@/shared/config/routes'
import { useQueryParams } from '@/shared/lib/hooks/use-query-params'
import { Box, Paper, Stack } from '@mantine/core'
import MenuItemsWidget from './components/menu-items'
import CategoriesListWidget from '../categories-list'

export function MenuEditorContentWdiget() {
  const { params } = useQueryParams(queryUrlConfig)
  const { restaurantId, section } = params

  if (!restaurantId) {
    return (
      <Paper withBorder radius="lg" className="min-h-140 flex-1 bg-white">
        <Box p={32}>
          <MenuEditorEmptyState />
        </Box>
      </Paper>
    )
  }

  return (
    <Paper withBorder radius="lg" className="min-h-140 flex-1 bg-white">
      <Box p={32} className="w-full">
        {section === MENU_SECTIONS.DISHES ? <MenuItemsWidget /> : null}
        {section === MENU_SECTIONS.CATEGORIES ? (
          <Stack gap="lg">
            <CategoryManagement />
            <CategoriesListWidget />
          </Stack>
        ) : null}
      </Box>
    </Paper>
  )
}
