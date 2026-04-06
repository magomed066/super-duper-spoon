import { unlink } from 'node:fs/promises'
import type { NextFunction, Request, Response } from 'express'
import type { MulterError } from 'multer'

import {
  RestaurantsHttpError,
  RestaurantService
} from './restaurant.service.js'
import { toPublicUploadPath } from '../../common/uploads/file-storage.js'

type UploadedRestaurantFiles = {
  logoFile?: Express.Multer.File[]
  previewFile?: Express.Multer.File[]
}

export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  private static readonly DEFAULT_PAGE = 1
  private static readonly DEFAULT_LIMIT = 10

  getById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const restaurant = await this.restaurantService.getAccessibleRestaurantById(
        this.getIdParam(req.params.id),
        req.user
      )

      res.status(200).json(restaurant)
    } catch (error: unknown) {
      next(this.normalizeError(error))
    }
  }

  list = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const includeInactiveMemberships = this.getBooleanQueryParam(
        req.query.includeInactiveMemberships
      )
      const isActive = this.getOptionalBooleanQueryParam(req.query.isActive)

      const restaurants = await this.restaurantService.getAccessibleRestaurants(
        req.user,
        {
          includeInactiveMemberships,
          page: this.getPositiveNumberQueryParam(
            req.query.page,
            RestaurantController.DEFAULT_PAGE,
            'Page must be a positive integer'
          ),
          limit: this.getPositiveNumberQueryParam(
            req.query.limit,
            RestaurantController.DEFAULT_LIMIT,
            'Limit must be a positive integer'
          ),
          search: this.getOptionalStringQueryParam(req.query.search),
          name: this.getOptionalStringQueryParam(req.query.name),
          city: this.getOptionalStringQueryParam(req.query.city),
          slug: this.getOptionalStringQueryParam(req.query.slug),
          isActive
        }
      )

      res.status(200).json(restaurants)
    } catch (error: unknown) {
      next(this.normalizeError(error))
    }
  }

  create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const uploadedFiles = this.getUploadedFiles(req.files)

    try {
      const normalizedBody = this.normalizeRestaurantPayload(req.body)
      const logoFile = uploadedFiles.logoFile?.[0]
      const previewFile = uploadedFiles.previewFile?.[0]

      this.assertUploadedFileSize(logoFile, 5, 'Логотип')
      this.assertUploadedFileSize(previewFile, 10, 'Обложка')

      const creationResult = await this.restaurantService.createRestaurant(
        {
          ...normalizedBody,
          logo: logoFile ? toPublicUploadPath(logoFile.filename) : normalizedBody.logo,
          preview: previewFile
            ? toPublicUploadPath(previewFile.filename)
            : normalizedBody.preview
        },
        req.user
      )

      res.status(201).json(creationResult)
    } catch (error: unknown) {
      await this.cleanupUploadedFiles(uploadedFiles)
      next(this.normalizeError(error))
    }
  }

  update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const restaurant = await this.restaurantService.updateRestaurant(
        this.getIdParam(req.params.id),
        req.body,
        req.user
      )

      res.status(200).json(restaurant)
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
      await this.restaurantService.deleteRestaurant(
        this.getIdParam(req.params.id),
        req.user
      )

      res.status(204).send()
    } catch (error: unknown) {
      next(this.normalizeError(error))
    }
  }

  assignManager = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.restaurantService.assignManager(
        this.getIdParam(req.params.id),
        req.body,
        req.user
      )

      res.status(result.created ? 201 : 200).json(result.membership)
    } catch (error: unknown) {
      next(this.normalizeError(error))
    }
  }

  removeManager = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await this.restaurantService.removeManager(
        this.getIdParam(req.params.id),
        this.getIdParam(req.params.userId),
        req.user
      )

      res.status(204).send()
    } catch (error: unknown) {
      next(this.normalizeError(error))
    }
  }

  getUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const memberships = await this.restaurantService.getRestaurantUsers(
        this.getIdParam(req.params.id),
        req.user
      )

      res.status(200).json(memberships)
    } catch (error: unknown) {
      next(this.normalizeError(error))
    }
  }

  private normalizeError(error: unknown): Error {
    if (error instanceof RestaurantsHttpError) {
      return error
    }

    if (
      error &&
      typeof error === 'object' &&
      'name' in error &&
      error.name === 'MulterError'
    ) {
      const multerError = error as MulterError
      return new RestaurantsHttpError(400, this.getMulterErrorMessage(multerError))
    }

    return new Error('Unexpected restaurant error')
  }

  private getIdParam(idParam: string | string[]): string {
    return Array.isArray(idParam) ? idParam[0] ?? '' : idParam
  }

  private getOptionalStringQueryParam(
    value: Request['query'][string]
  ): string | undefined {
    const normalizedValue = Array.isArray(value) ? value[0] : value

    if (typeof normalizedValue !== 'string') {
      return undefined
    }

    const trimmedValue = normalizedValue.trim()

    return trimmedValue.length > 0 ? trimmedValue : undefined
  }

  private getBooleanQueryParam(value: Request['query'][string]): boolean {
    return this.getOptionalStringQueryParam(value) === 'true'
  }

  private getOptionalBooleanQueryParam(
    value: Request['query'][string]
  ): boolean | undefined {
    const normalizedValue = this.getOptionalStringQueryParam(value)

    if (normalizedValue === undefined) {
      return undefined
    }

    if (normalizedValue === 'true') {
      return true
    }

    if (normalizedValue === 'false') {
      return false
    }

    throw new RestaurantsHttpError(
      400,
      'isActive must be a boolean value'
    )
  }

  private getPositiveNumberQueryParam(
    value: Request['query'][string],
    fallbackValue: number,
    errorMessage: string
  ): number {
    const normalizedValue = this.getOptionalStringQueryParam(value)

    if (normalizedValue === undefined) {
      return fallbackValue
    }

    const parsedValue = Number(normalizedValue)

    if (!Number.isInteger(parsedValue) || parsedValue < 1) {
      throw new RestaurantsHttpError(400, errorMessage)
    }

    return parsedValue
  }

  private getUploadedFiles(files: Request['files']): UploadedRestaurantFiles {
    if (!files || Array.isArray(files)) {
      return {}
    }

    return files as UploadedRestaurantFiles
  }

  private normalizeRestaurantPayload(body: Request['body']): Record<string, unknown> {
    return {
      ...body,
      phones: this.parseOptionalJsonField(body.phones),
      cuisine: this.parseOptionalJsonField(body.cuisine),
      workSchedule: this.parseOptionalJsonField(body.workSchedule),
      deliveryTime: this.parseOptionalNumberField(body.deliveryTime)
    }
  }

  private parseOptionalJsonField(value: unknown): unknown {
    if (typeof value !== 'string') {
      return value
    }

    const trimmedValue = value.trim()

    if (!trimmedValue) {
      return undefined
    }

    try {
      return JSON.parse(trimmedValue)
    } catch {
      return value
    }
  }

  private parseOptionalNumberField(value: unknown): unknown {
    if (typeof value !== 'string') {
      return value
    }

    const trimmedValue = value.trim()

    if (!trimmedValue) {
      return undefined
    }

    const parsedValue = Number(trimmedValue)

    return Number.isNaN(parsedValue) ? value : parsedValue
  }

  private assertUploadedFileSize(
    file: Express.Multer.File | undefined,
    maxSizeMb: number,
    label: string
  ): void {
    if (!file) {
      return
    }

    if (file.size > maxSizeMb * 1024 * 1024) {
      throw new RestaurantsHttpError(
        400,
        `${label} должен быть не больше ${maxSizeMb} МБ`
      )
    }
  }

  private async cleanupUploadedFiles(files: UploadedRestaurantFiles): Promise<void> {
    const uploadedFiles = [...(files.logoFile ?? []), ...(files.previewFile ?? [])]

    await Promise.all(
      uploadedFiles.map(async (file) => {
        try {
          await unlink(file.path)
        } catch {
          // Best-effort cleanup for failed requests.
        }
      })
    )
  }

  private getMulterErrorMessage(error: MulterError): string {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return 'Файл должен быть не больше 10 МБ'
    }

    if (error.code === 'LIMIT_FILE_COUNT') {
      return 'Можно загрузить не более двух файлов'
    }

    return error.message
  }
}
