import type { QueryParamConfig } from '@/shared/lib/query-string'
import { MenuEditorContentWdiget } from './menu-editor-content.ui'
import type { QueryUrlConfig } from '@/shared/config/routes/types'

export default MenuEditorContentWdiget

export const UrlQueryConfig: QueryParamConfig<QueryUrlConfig> = {
  restaurantId: {
    parse: (value) => value?.trim() ?? '',
    serialize: (value) => value.trim() || undefined
  },
  section: {
    parse: (value) => value?.trim() ?? 'dishes',
    serialize: (value) =>
      value.trim() && value !== 'dishes' ? value : undefined
  },
  categoryId: {
    parse: (value) => value?.trim() ?? '',
    serialize: (value) => value.trim() || undefined
  }
}
