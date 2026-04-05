import type { JwtPayload } from 'jsonwebtoken'

export type AuthTokensDto = {
  accessToken: string
  refreshToken: string
}

export type AccessTokenDto = {
  accessToken: string
}

export type AccessTokenPayload = JwtPayload & {
  sub: string
  email: string
  role: string
}

export type RefreshTokenPayload = JwtPayload & {
  sub: string
}
