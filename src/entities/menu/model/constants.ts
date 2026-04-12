import { TbCategory, TbPlus, TbSoup } from 'react-icons/tb'
import type { MenuEditorSection } from './types'

export const menuItemsQueryKeys = {
  all: (restaurantId?: string) =>
    restaurantId ? ['restaurants', restaurantId, 'menu-items'] : ['menu-items'],
  detail: (restaurantId: string, itemId: string) => [
    'restaurants',
    restaurantId,
    'menu-items',
    itemId
  ]
} as const

export const MENU_EDITOR_SECTIONS: MenuEditorSection[] = [
  {
    id: 'dishes',
    title: 'Блюда',
    description: 'Основные позиции меню и их наполнение.',
    icon: TbSoup
  },
  {
    id: 'addons',
    title: 'Добавки',
    description: 'Соусы, топпинги и дополнительные опции.',
    icon: TbPlus
  },
  {
    id: 'categories',
    title: 'Категории',
    description: 'Структура разделов меню и порядок отображения.',
    icon: TbCategory
  },
  {
    id: 'order-extras',
    title: 'Добавить к заказу',
    description: 'Дополнительные предложения перед оформлением заказа.',
    icon: TbCategory
  }
]

export const MENU_SECTIONS = {
  DISHES: 'dishes',
  ADDONS: 'addons',
  CATEGORIES: 'categories'
}
