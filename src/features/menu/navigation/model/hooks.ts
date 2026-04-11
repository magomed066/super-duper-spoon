import { MENU_EDITOR_SECTIONS, type MenuEditorSectionId } from '@/entities/menu'
import { useQueryParams } from '@/shared/lib/hooks/use-query-params'
import { menuNavigationQueryConfig } from './config'

const defaultSection = MENU_EDITOR_SECTIONS[0]

function isMenuEditorSectionId(value: string): value is MenuEditorSectionId {
  return MENU_EDITOR_SECTIONS.some((section) => section.id === value)
}

export function useMenuNavigation() {
  const { params, setParams } = useQueryParams(menuNavigationQueryConfig)
  const { restaurantId, section, categoryId } = params

  const selectedSectionId = isMenuEditorSectionId(section)
    ? section
    : defaultSection.id

  const handleRestaurantSelect = (id: string | null) => {
    setParams({
      restaurantId: id ?? '',
      section: defaultSection.id,
      categoryId: ''
    })
  }

  const handleSectionSelect = (nextSection: MenuEditorSectionId) => {
    setParams({
      section: nextSection,
      categoryId: ''
    })
  }

  const handleCategorySelect = (nextCategoryId: string) => {
    setParams({
      section: defaultSection.id,
      categoryId: nextCategoryId
    })
  }

  return {
    restaurantId,
    selectedSectionId,
    selectedCategoryId: categoryId,
    handleRestaurantSelect,
    handleSectionSelect,
    handleCategorySelect
  }
}
