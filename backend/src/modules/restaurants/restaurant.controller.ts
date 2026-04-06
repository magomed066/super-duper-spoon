import type { NextFunction, Request, Response } from 'express'

import {
  RestaurantsHttpError,
  RestaurantService
} from './restaurant.service.js'

export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

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
      const includeInactiveMemberships =
        req.query.includeInactiveMemberships === 'true'

      const restaurants = await this.restaurantService.getAccessibleRestaurants(
        req.user,
        {
          includeInactiveMemberships
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
    try {
      const creationResult = await this.restaurantService.createRestaurant(
        req.body,
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

    return new Error('Unexpected restaurant error')
  }

  private getIdParam(idParam: string | string[]): string {
    return Array.isArray(idParam) ? idParam[0] ?? '' : idParam
  }
}
