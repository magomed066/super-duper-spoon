import type { JwtPayload } from 'jsonwebtoken'

import type { RefreshTokenPayload } from '../modules/auth/types/auth.types.js'

export const isRefreshTokenPayload = (
  payload: string | JwtPayload
): payload is RefreshTokenPayload =>
  typeof payload !== 'string' &&
  typeof payload.sub === 'string' &&
  payload.sub.length > 0

export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
