export class MenuDomainError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string
  ) {
    super(message)
    this.name = 'MenuDomainError'
  }
}

export class MenuRestaurantAccessForbiddenError extends MenuDomainError {
  constructor() {
    super(403, 'MENU_RESTAURANT_ACCESS_FORBIDDEN', 'Access denied')
  }
}

export class MenuRestaurantIdRequiredError extends MenuDomainError {
  constructor() {
    super(400, 'MENU_RESTAURANT_ID_REQUIRED', 'Restaurant id is required')
  }
}

export class MenuRestaurantNotFoundError extends MenuDomainError {
  constructor() {
    super(404, 'MENU_RESTAURANT_NOT_FOUND', 'Restaurant not found')
  }
}

export class MenuRestaurantNotPublicError extends MenuDomainError {
  constructor() {
    super(
      409,
      'MENU_RESTAURANT_NOT_PUBLIC',
      'Restaurant is not active'
    )
  }
}

export class MenuMutationNotAllowedError extends MenuDomainError {
  constructor(status: string) {
    super(
      409,
      'MENU_MUTATION_NOT_ALLOWED',
      `Menu cannot be updated for restaurant in status ${status}`
    )
  }
}

export class MenuCategoryIdRequiredError extends MenuDomainError {
  constructor() {
    super(400, 'MENU_CATEGORY_ID_REQUIRED', 'Category id is required')
  }
}

export class MenuCategoryNotFoundError extends MenuDomainError {
  constructor() {
    super(404, 'MENU_CATEGORY_NOT_FOUND', 'Category not found')
  }
}

export class MenuCategoryRestaurantMismatchError extends MenuDomainError {
  constructor() {
    super(
      409,
      'MENU_CATEGORY_RESTAURANT_MISMATCH',
      'Category does not belong to restaurant'
    )
  }
}

export class MenuCategoryNotEmptyError extends MenuDomainError {
  constructor() {
    super(
      409,
      'MENU_CATEGORY_NOT_EMPTY',
      'Category cannot be deleted while it still contains menu items. Delete or move those items first.'
    )
  }
}

export class MenuItemIdRequiredError extends MenuDomainError {
  constructor() {
    super(400, 'MENU_ITEM_ID_REQUIRED', 'Menu item id is required')
  }
}

export class MenuItemNotFoundError extends MenuDomainError {
  constructor() {
    super(404, 'MENU_ITEM_NOT_FOUND', 'Menu item not found')
  }
}

export class MenuItemRestaurantMismatchError extends MenuDomainError {
  constructor() {
    super(
      409,
      'MENU_ITEM_RESTAURANT_MISMATCH',
      'Menu item does not belong to restaurant'
    )
  }
}

export class MenuHttpError extends MenuDomainError {
  constructor(statusCode: number, message: string, code = 'MENU_ERROR') {
    super(statusCode, code, message)
    this.name = 'MenuHttpError'
  }
}
