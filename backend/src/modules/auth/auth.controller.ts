import type { NextFunction, Request, Response } from 'express'

import { LoginDto, RefreshTokenDto } from './dto/auth.dto.js'
import { AuthHttpError, AuthService } from './auth.service.js'

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tokens = await this.authService.login(LoginDto.from(req.body))

      res.status(200).json(tokens)
    } catch (error: unknown) {
      next(this.normalizeError(error))
    }
  }

  refresh = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const accessToken = await this.authService.refresh(
        RefreshTokenDto.from(req.body)
      )

      res.status(200).json(accessToken)
    } catch (error: unknown) {
      next(this.normalizeError(error))
    }
  }

  logout = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await this.authService.logout(RefreshTokenDto.from(req.body))

      res.status(204).send()
    } catch (error: unknown) {
      next(this.normalizeError(error))
    }
  }

  private normalizeError(error: unknown): Error {
    if (error instanceof AuthHttpError) {
      return error
    }

    return new Error('Unexpected auth error')
  }
}
