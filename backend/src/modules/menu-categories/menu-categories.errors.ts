import {
  MenuCategoryIdRequiredError as SharedMenuCategoryIdRequiredError,
  MenuCategoryNotEmptyError as SharedMenuCategoryNotEmptyError,
  MenuCategoryNotFoundError as SharedMenuCategoryNotFoundError,
  MenuDomainError
} from '../menu/menu.errors.js'

export class MenuCategoriesDomainError extends MenuDomainError {}

export class MenuCategoryIdRequiredError extends SharedMenuCategoryIdRequiredError {}

export class MenuCategoryNotFoundError extends SharedMenuCategoryNotFoundError {}

export class MenuCategoryNotEmptyError extends SharedMenuCategoryNotEmptyError {}

export class MenuCategoriesHttpError extends MenuCategoriesDomainError {
  constructor(statusCode: number, message: string, code = 'MENU_CATEGORIES_ERROR') {
    super(statusCode, code, message)
    this.name = 'MenuCategoriesHttpError'
  }
}
