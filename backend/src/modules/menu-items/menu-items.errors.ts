import {
  MenuCategoryIdRequiredError as SharedMenuCategoryIdRequiredError,
  MenuCategoryNotFoundError as SharedMenuCategoryNotFoundError,
  MenuCategoryRestaurantMismatchError,
  MenuDomainError,
  MenuItemIdRequiredError as SharedMenuItemIdRequiredError,
  MenuItemNotFoundError as SharedMenuItemNotFoundError
} from '../menu/menu.errors.js'

export class MenuItemsDomainError extends MenuDomainError {}

export class MenuItemIdRequiredError extends SharedMenuItemIdRequiredError {}

export class MenuItemNotFoundError extends SharedMenuItemNotFoundError {}

export class MenuItemCategoryIdRequiredError extends SharedMenuCategoryIdRequiredError {}

export class MenuItemCategoryNotFoundError extends SharedMenuCategoryNotFoundError {}

export class MenuItemCategoryRestaurantMismatchError extends MenuCategoryRestaurantMismatchError {}

export class MenuItemsHttpError extends MenuItemsDomainError {
  constructor(statusCode: number, message: string, code = 'MENU_ITEMS_ERROR') {
    super(statusCode, code, message)
    this.name = 'MenuItemsHttpError'
  }
}
