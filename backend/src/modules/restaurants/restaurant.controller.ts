import type { NextFunction, Request, Response } from 'express'

import {
  RestaurantsHttpError,
  RestaurantService
} from './restaurant.service.js'

export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  list = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const restaurants = await this.restaurantService.getAccessibleRestaurants(
        req.user
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
}
