import type { NextFunction, Request, Response } from 'express'

import {
  toPublicMenuUploadPath
} from '../../common/uploads/file-storage.js'
import {
  assertUploadedMenuItemFileSize,
  cleanupReplacedMenuItemFile,
  cleanupUploadedMenuItemFile
} from './helpers/menu-item-media.helpers.js'
import { MenuItemsDomainError, MenuItemsHttpError } from './menu-items.errors.js'
import { MenuItemsService } from './menu-items.service.js'

export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const imageFile = req.file

      assertUploadedMenuItemFileSize(imageFile, 10, 'Изображение блюда')

      const item = await this.menuItemsService.createItem(
        this.getIdParam(req.params.restaurantId),
        {
          ...req.body,
          image: imageFile ? toPublicMenuUploadPath(imageFile.filename) : req.body.image
        },
        req.user
      )

      res.status(201).json(item)
    } catch (error: unknown) {
      await cleanupUploadedMenuItemFile(req.file)
      next(this.normalizeError(error))
    }
  }

  listByRestaurant = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const items = await this.menuItemsService.getRestaurantItems(
        this.getIdParam(req.params.restaurantId),
        req.user
      )

      res.status(200).json(items)
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
      const imageFile = req.file

      assertUploadedMenuItemFileSize(imageFile, 10, 'Изображение блюда')

      const currentItem = imageFile
        ? await this.menuItemsService.getItemForRestaurant(
            this.getIdParam(req.params.itemId),
            this.getIdParam(req.params.restaurantId)
          )
        : null

      const item = await this.menuItemsService.updateItem(
        this.getIdParam(req.params.restaurantId),
        this.getIdParam(req.params.itemId),
        {
          ...req.body,
          image: imageFile ? toPublicMenuUploadPath(imageFile.filename) : req.body.image
        },
        req.user
      )

      await cleanupReplacedMenuItemFile(
        currentItem?.image ?? null,
        item.image,
        Boolean(imageFile)
      )

      res.status(200).json(item)
    } catch (error: unknown) {
      await cleanupUploadedMenuItemFile(req.file)
      next(this.normalizeError(error))
    }
  }

  delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await this.menuItemsService.deleteItem(
        this.getIdParam(req.params.restaurantId),
        this.getIdParam(req.params.itemId),
        req.user
      )

      res.status(204).send()
    } catch (error: unknown) {
      next(this.normalizeError(error))
    }
  }

  private normalizeError(error: unknown): Error {
    if (error instanceof Error && error.message.includes('должен быть не больше')) {
      return new MenuItemsHttpError(400, error.message)
    }

    if (error instanceof MenuItemsHttpError || error instanceof MenuItemsDomainError) {
      return error
    }

    return new Error('Unexpected menu items error')
  }

  private getIdParam(idParam: string | string[]): string {
    return Array.isArray(idParam) ? idParam[0] ?? '' : idParam
  }
}
