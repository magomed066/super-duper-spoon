import type { NextFunction, Request, Response } from 'express'

import { normalizeRestaurantPayload } from './helpers/restaurant-payload.helpers.js'
import { RestaurantStatus } from './enums/restaurant-status.enum.js'
import { RestaurantsHttpError } from './restaurants.errors.js'
import { RestaurantService } from './restaurant.service.js'

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

  getPublicById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const restaurant = await this.restaurantService.getPublicRestaurantById(
        this.getIdParam(req.params.id)
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
      const status = this.getOptionalStatusQueryParam(req.query.status)

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
          status,
          isActive
        }
      )

      res.status(200).json(restaurants)
    } catch (error: unknown) {
      next(this.normalizeError(error))
    }
  }

  listPublic = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const restaurants = await this.restaurantService.getPublicRestaurants({
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
        slug: this.getOptionalStringQueryParam(req.query.slug)
      })

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
    try {
      const normalizedBody = normalizeRestaurantPayload(req.body)

      const creationResult = await this.restaurantService.createRestaurant(
        normalizedBody,
        req.user
      )

      res.status(201).json(creationResult)
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
      const normalizedBody = normalizeRestaurantPayload(req.body)
      const restaurant = await this.restaurantService.updateRestaurant(
        this.getIdParam(req.params.id),
        normalizedBody,
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

  submitForApproval = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const restaurant = await this.restaurantService.submitForApproval(
        this.getIdParam(req.params.id),
        req.user
      )

      res.status(200).json(restaurant)
    } catch (error: unknown) {
      next(this.normalizeError(error))
    }
  }

  requestChanges = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const restaurant = await this.restaurantService.requestChanges(
        this.getIdParam(req.params.id),
        req.user
      )

      res.status(200).json(restaurant)
    } catch (error: unknown) {
      next(this.normalizeError(error))
    }
  }

  approve = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const restaurant = await this.restaurantService.approve(
        this.getIdParam(req.params.id),
        req.user
      )

      res.status(200).json(restaurant)
    } catch (error: unknown) {
      next(this.normalizeError(error))
    }
  }

  reject = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const restaurant = await this.restaurantService.reject(
        this.getIdParam(req.params.id),
        req.user
      )

      res.status(200).json(restaurant)
    } catch (error: unknown) {
      next(this.normalizeError(error))
    }
  }

  block = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const restaurant = await this.restaurantService.block(
        this.getIdParam(req.params.id),
        req.user
      )

      res.status(200).json(restaurant)
    } catch (error: unknown) {
      next(this.normalizeError(error))
    }
  }

  unblock = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const restaurant = await this.restaurantService.unblock(
        this.getIdParam(req.params.id),
        req.user
      )

      res.status(200).json(restaurant)
    } catch (error: unknown) {
      next(this.normalizeError(error))
    }
  }

  archive = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const restaurant = await this.restaurantService.archive(
        this.getIdParam(req.params.id),
        req.user
      )

      res.status(200).json(restaurant)
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

  private getOptionalStatusQueryParam(
    value: Request['query'][string]
  ): RestaurantStatus | undefined {
    const normalizedValue = this.getOptionalStringQueryParam(value)

    if (normalizedValue === undefined) {
      return undefined
    }

    if (Object.values(RestaurantStatus).includes(normalizedValue as RestaurantStatus)) {
      return normalizedValue as RestaurantStatus
    }

    throw new RestaurantsHttpError(400, 'status must be a valid restaurant status')
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
}
