import type { NextFunction, Request, Response } from 'express'

import { MenuDomainError, MenuHttpError } from './menu.errors.js'
import { MenuService } from './menu.service.js'

export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  getPublicRestaurantMenu = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const menu = await this.menuService.getPublicRestaurantMenu(
        this.getIdParam(req.params.restaurantId)
      )

      res.status(200).json(menu)
    } catch (error: unknown) {
      next(this.normalizeError(error))
    }
  }

  private normalizeError(error: unknown): Error {
    if (error instanceof MenuHttpError || error instanceof MenuDomainError) {
      return error
    }

    return new Error('Unexpected menu error')
  }

  private getIdParam(idParam: string | string[]): string {
    return Array.isArray(idParam) ? idParam[0] ?? '' : idParam
  }
}
