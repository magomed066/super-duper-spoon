import { TbCategory, TbPlus, TbSoup } from 'react-icons/tb'
import type { MenuEditorSection } from './types'

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
