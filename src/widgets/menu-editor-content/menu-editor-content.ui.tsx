// import { useState } from 'react'

import { MENU_SECTIONS, MenuEditorEmptyState } from '@/entities/menu'
import { queryUrlConfig } from '@/shared/config/routes'
import { useQueryParams } from '@/shared/lib/hooks/use-query-params'
import { Box, Paper } from '@mantine/core'
import MenuItemsWidget from './components/menu-items'

export function MenuEditorContentWdiget() {
  // const

  const { params } = useQueryParams(queryUrlConfig)
  const { restaurantId, section } = params

  // const { restaurantId, selectedSectionId, selectedCategoryId } =
  //   useMenuNavigation()
  // const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  // const { data: restaurant } = useRestaurantQuery(
  //   restaurantId,
  //   Boolean(restaurantId)
  // )

  // const { data: categories } = useCategoriesQuery(
  //   restaurantId,
  //   Boolean(restaurantId)
  // )
  // const { data: menuItems } = useMenuItemsQuery(
  //   restaurantId,
  //   Boolean(restaurantId)
  // )
  // const updateMenuItemMutation = useUpdateMenuItemMutation(restaurantId)

  // const selectedSection =
  //   MENU_EDITOR_SECTIONS.find((item) => item.id === selectedSectionId) ??
  //   MENU_EDITOR_SECTIONS[0]
  // const selectedCategory = categories?.find(
  //   (item) => item.id === selectedCategoryId
  // )
  // const selectedCategoryItems = useMemo(
  //   () =>
  //     menuItems?.filter((item) => item.categoryId === selectedCategoryId) ?? [],
  //   [menuItems, selectedCategoryId]
  // )
  // const allMenuItems = menuItems ?? []
  // const canAddMenuItemFromSection =
  //   selectedSectionId === 'dishes' &&
  //   Boolean(categories?.some((item) => item.isActive)) &&
  //   !selectedCategory

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
      </Box>
    </Paper>
  )
}
//  {/* <Box p={32}>
//         {!restaurantId ? (
//           <MenuEditorEmptyState />
//         ) : (
//           <Stack gap="xl">
//             <Stack gap={8}>
//               <Group justify="space-between" align="flex-start">
//                 <Group gap="sm">
//                   <Title order={2} className="text-moss-900">
//                     {selectedCategory?.name ?? selectedSection.title}
//                   </Title>
//                 </Group>

//                 {canAddMenuItemFromSection ? (
//                   <Button
//                     leftSection={<TbPlus size={16} />}
//                     color="aurora"
//                     radius="md"
//                     onClick={() => setIsCreateModalOpen(true)}
//                   >
//                     Добавить блюдо
//                   </Button>
//                 ) : null}
//               </Group>

//               <Text maw={760} className="leading-7 text-moss-700">
//                 {selectedCategory
//                   ? selectedCategory.description?.trim() ||
//                     'Описание категории пока не заполнено. Здесь можно подготовить рабочую область для наполнения блюд и контроля состава.'
//                   : selectedSection.description}
//               </Text>
//             </Stack>

//             <Divider color="rgba(0,0,0,0.08)" />

//             {selectedCategory ? (
//               <Stack gap="lg">
//                 <Group justify="space-between" align="center">
//                   <div>
//                     <Text fw={700} className="text-moss-900">
//                       Блюда категории
//                     </Text>
//                     <Text size="sm" className="mt-1 text-moss-600">
//                       {selectedCategoryItems.length} позиций в текущей
//                       категории.
//                     </Text>
//                   </div>

//                   <Button
//                     leftSection={<TbPlus size={16} />}
//                     color="dark"
//                     radius="xl"
//                     onClick={() => setIsCreateModalOpen(true)}
//                   >
//                     Добавить блюдо
//                   </Button>
//                 </Group>

//                 {selectedCategoryItems.length ? (
//                   <Stack gap="sm">
//                     {selectedCategoryItems.map((item) => (
//                       <MenuItemRow
//                         key={item.id}
//                         item={item}
//                         disabled={updateMenuItemMutation.isPending}
//                         onToggleActive={(nextValue) =>
//                           updateMenuItemMutation.mutate({
//                             itemId: item.id,
//                             payload: {
//                               isActive: nextValue
//                             }
//                           })
//                         }
//                       />
//                     ))}
//                   </Stack>
//                 ) : (
//                   <MenuContentCard
//                     title="В категории пока нет блюд"
//                     description="Создайте первую позицию, чтобы начать наполнять меню. После сохранения блюдо сразу появится в списке."
//                   />
//                 )}

//                 <CreateMenuItemModal
//                   opened={isCreateModalOpen}
//                   onClose={() => setIsCreateModalOpen(false)}
//                   restaurantId={restaurantId}
//                   categoryId={selectedCategory.id}
//                 />
//               </Stack>
//             ) : canAddMenuItemFromSection ? (
//               <Stack gap="lg">
//                 {/* <Stack gap={4}>
//                   <Text fw={700} className="text-moss-900">
//                     Все блюда
//                   </Text>
//                   <Text size="sm" className="text-moss-600">
//                     {allMenuItems.length} позиций во всех категориях ресторана.
//                   </Text>
//                 </Stack> */}

//                 {allMenuItems.length ? (
// <Stack gap="sm">
//   {allMenuItems.map((item) => {
//     const itemCategory = categories?.find(
//       (category) => category.id === item.categoryId
//     )

//     return (
//       <MenuItemRow
//         key={item.id}
//         item={item}
//         categoryLabel={itemCategory?.name ?? 'Без категории'}
//         disabled={updateMenuItemMutation.isPending}
//         onToggleActive={(nextValue) =>
//           updateMenuItemMutation.mutate({
//             itemId: item.id,
//             payload: {
//               isActive: nextValue
//             }
//           })
//         }
//       />
//     )
//   })}
// </Stack>
//                 ) : (
//                   <MenuContentCard
//                     title="Блюд пока нет"
//                     description="Создайте первую позицию, и она появится в общем списке раздела."
//                   />
//                 )}

// <CreateMenuItemModal
//   opened={isCreateModalOpen}
//   onClose={() => setIsCreateModalOpen(false)}
//   restaurantId={restaurantId}
//   categories={categories}
// />
//               </Stack>
//             ) : null}
//           </Stack>
//         )}
//       </Box> */}
