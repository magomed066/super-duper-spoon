import bcrypt from 'bcrypt'
import jwt, { type JwtPayload } from 'jsonwebtoken'

import { env } from '../../config/index.js'
import { User } from '../users/entities/user.entity.js'
import { type LoginDto, type RefreshTokenDto } from './dto/auth.dto.js'
import { AuthRepository } from './auth.repository.js'
import {
  ACCESS_TOKEN_EXPIRES_IN_SECONDS,
  REFRESH_TOKEN_EXPIRES_IN_SECONDS
} from '../../helpers/constants.js'
import {
  AccessTokenDto,
  AccessTokenPayload,
  AuthTokensDto
} from './types/auth.types.js'
import { isRefreshTokenPayload, isValidEmail } from '../../helpers/utils.js'

export class AuthHttpError extends Error {
  constructor(public readonly statusCode: number, message: string) {
    super(message)
    this.name = 'AuthHttpError'
  }
}

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async login({ email, password }: LoginDto): Promise<AuthTokensDto> {
    this.validateCredentials(email, password)

    const user = await this.authRepository.findUserByEmail(email.toLowerCase())

    if (!user || !user.isActive) {
      throw new AuthHttpError(401, 'Invalid email or password')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      throw new AuthHttpError(401, 'Invalid email or password')
    }

    const accessToken = this.generateAccessToken(user)
    const refreshToken = this.generateRefreshToken(user)

    await this.authRepository.saveRefreshToken(
      refreshToken,
      new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN_SECONDS * 1000),
      user
    )

    return {
      accessToken,
      refreshToken
    }
  }

  async refresh({ refreshToken }: RefreshTokenDto): Promise<AccessTokenDto> {
    if (!refreshToken.trim()) {
      throw new AuthHttpError(400, 'Refresh token is required')
    }

    let payload: string | JwtPayload

    try {
      payload = jwt.verify(refreshToken, env.refreshTokenSecret)
    } catch {
      throw new AuthHttpError(401, 'Invalid or expired refresh token')
    }

    // JWT validity alone is not enough: the same token must still exist in storage.
    if (!isRefreshTokenPayload(payload)) {
      throw new AuthHttpError(401, 'Invalid refresh token payload')
    }

    const tokenRecord = await this.authRepository.findRefreshToken(refreshToken)

    if (!tokenRecord) {
      throw new AuthHttpError(401, 'Refresh token not found')
    }

    if (tokenRecord.expiresAt.getTime() <= Date.now()) {
      // Expired DB records are removed lazily during refresh attempts.
      await this.authRepository.deleteRefreshTokenById(tokenRecord.id)
      throw new AuthHttpError(401, 'Refresh token expired')
    }

    if (tokenRecord.user.id !== payload.sub || !tokenRecord.user.isActive) {
      throw new AuthHttpError(401, 'User is not authorized')
    }

    return {
      accessToken: this.generateAccessToken(tokenRecord.user)
    }
  }

  async logout({ refreshToken }: RefreshTokenDto): Promise<void> {
    if (!refreshToken.trim()) {
      throw new AuthHttpError(400, 'Refresh token is required')
    }

    await this.authRepository.deleteRefreshTokenByToken(refreshToken)
  }

  private validateCredentials(email: string, password: string): void {
    if (!email.trim() || !password.trim()) {
      throw new AuthHttpError(400, 'Email and password are required')
    }

    if (!isValidEmail(email)) {
      throw new AuthHttpError(400, 'Email format is invalid')
    }
  }

  private generateAccessToken(user: User): string {
    const payload: AccessTokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role
    }

    return jwt.sign(payload, env.accessTokenSecret, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN_SECONDS
    })
  }

  private generateRefreshToken(user: User): string {
    return jwt.sign(
      {
        sub: user.id
      },
      env.refreshTokenSecret,
      {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN_SECONDS
      }
    )
  }
}
