import type { JwtPayload } from 'jsonwebtoken'

import { UserRole } from '../../users/enums/user-role.enum.js'

export type AuthTokensDto = {
  accessToken: string
  refreshToken: string
}

export type AuthUserDto = {
  id: string
  firstName: string
  lastName: string
  phone: string
  email: string
  status: string
  role: UserRole
  isActive: boolean
  createdAt: Date
}

export type AuthLoginResponseDto = AuthTokensDto & {
  user: AuthUserDto
}

export type AccessTokenDto = {
  accessToken: string
}

export type AccessTokenPayload = JwtPayload & {
  sub: string
  email: string
  role: UserRole
}

export type RefreshTokenPayload = JwtPayload & {
  sub: string
}
