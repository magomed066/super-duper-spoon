import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import { env } from '../../config/index.js'
import type { AccessTokenPayload } from '../../modules/auth/types/auth.types.js'

const extractBearerToken = (authorizationHeader?: string): string | null => {
  if (!authorizationHeader) {
    return null
  }

  const [scheme, token] = authorizationHeader.split(' ')

  if (scheme !== 'Bearer' || !token) {
    return null
  }

  return token
}

const isAccessTokenPayload = (payload: unknown): payload is AccessTokenPayload =>
  typeof payload === 'object' &&
  payload !== null &&
  'userId' in payload &&
  typeof payload.userId === 'string' &&
  payload.userId.length > 0 &&
  'role' in payload &&
  typeof payload.role === 'string'

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = extractBearerToken(req.headers.authorization)

  if (!token) {
    res.status(401).json({
      status: 'error',
      message: 'Access token is required'
    })
    return
  }

  try {
    const payload = jwt.verify(token, env.accessTokenSecret)

    if (!isAccessTokenPayload(payload)) {
      res.status(401).json({
        status: 'error',
        message: 'Invalid access token payload'
      })
      return
    }

    req.user = {
      id: payload.userId,
      role: payload.role
    }
    next()
  } catch {
    res.status(401).json({
      status: 'error',
      message: 'Invalid or expired access token'
    })
  }
}
