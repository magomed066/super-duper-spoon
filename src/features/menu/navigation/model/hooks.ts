import {
  MENU_EDITOR_SECTIONS,
  MENU_SECTIONS,
  useMenuQueryParams,
  type MenuEditorSectionId
} from '@/entities/menu'

const defaultSection = MENU_EDITOR_SECTIONS[0]

function isMenuEditorSectionId(value: string): value is MenuEditorSectionId {
  return MENU_EDITOR_SECTIONS.some(
    (section) => section.id === value && !section.disabled
  )
}

export function useMenuNavigation() {
  const { params, setParams } = useMenuQueryParams()
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
    const nextSectionConfig = MENU_EDITOR_SECTIONS.find(
      (section) => section.id === nextSection
    )

    if (nextSectionConfig?.disabled) {
      return
    }

    setParams({
      section: nextSection,
      categoryId: ''
    })
  }

  const handleCategorySelect = (nextCategoryId: string) => {
    setParams({
      section: MENU_SECTIONS.CATEGORY,
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
