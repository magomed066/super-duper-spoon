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
      const restaurant = await this.restaurantService.createRestaurant(
        req.body,
        req.user
      )

      res.status(201).json(restaurant)
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
