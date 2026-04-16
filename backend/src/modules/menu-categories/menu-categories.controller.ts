import type { NextFunction, Request, Response } from 'express'

import {
  MenuCategoriesDomainError,
  MenuCategoriesHttpError
} from './menu-categories.errors.js'
import { MenuCategoriesService } from './menu-categories.service.js'

export class MenuCategoriesController {
  constructor(private readonly menuCategoriesService: MenuCategoriesService) {}

  create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const category = await this.menuCategoriesService.createCategory(
        this.getIdParam(req.params.restaurantId),
        req.body,
        req.user
      )

      res.status(201).json(category)
    } catch (error: unknown) {
      next(this.normalizeError(error))
    }
  }

  listByRestaurant = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const categories = await this.menuCategoriesService.getRestaurantCategories(
        this.getIdParam(req.params.restaurantId),
        req.user
      )

      res.status(200).json(categories)
    } catch (error: unknown) {
      next(this.normalizeError(error))
    }
  }

  update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const category = await this.menuCategoriesService.updateCategory(
        this.getIdParam(req.params.restaurantId),
        this.getIdParam(req.params.categoryId),
        req.body,
        req.user
      )

      res.status(200).json(category)
    } catch (error: unknown) {
      next(this.normalizeError(error))
    }
  }

  reorder = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const categories = await this.menuCategoriesService.reorderCategories(
        this.getIdParam(req.params.restaurantId),
        req.body,
        req.user
      )

      res.status(200).json(categories)
    } catch (error: unknown) {
      next(this.normalizeError(error))
    }
  }

  delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await this.menuCategoriesService.deleteCategory(
        this.getIdParam(req.params.restaurantId),
        this.getIdParam(req.params.categoryId),
        req.user
      )

      res.status(204).send()
    } catch (error: unknown) {
      next(this.normalizeError(error))
    }
  }

  private normalizeError(error: unknown): Error {
    if (
      error instanceof MenuCategoriesHttpError ||
      error instanceof MenuCategoriesDomainError
    ) {
      return error
    }

    return new Error('Unexpected menu categories error')
  }

  private getIdParam(idParam: string | string[]): string {
    return Array.isArray(idParam) ? idParam[0] ?? '' : idParam
  }
}
