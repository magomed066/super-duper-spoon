import type { NextFunction, Request, Response } from 'express'

import { UsersHttpError, UsersService } from './users.service.js'

export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  block = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = await this.usersService.blockUser(this.getIdParam(req.params.id))

      res.status(200).json(user)
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
      const user = await this.usersService.unblockUser(
        this.getIdParam(req.params.id)
      )

      res.status(200).json(user)
    } catch (error: unknown) {
      next(this.normalizeError(error))
    }
  }

  private normalizeError(error: unknown): Error {
    if (error instanceof UsersHttpError) {
      return error
    }

    return new Error('Unexpected users error')
  }

  private getIdParam(idParam: string | string[]): string {
    return Array.isArray(idParam) ? idParam[0] ?? '' : idParam
  }
}
