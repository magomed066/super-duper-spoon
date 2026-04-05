import type { NextFunction, Request, Response } from 'express'
import jwt, { type JwtPayload } from 'jsonwebtoken'

import { env } from '../../config/index.js'
import { AppDataSource } from '../../database/data-source.js'
import { User } from '../../modules/users/entities/user.entity.js'

type AccessTokenPayload = JwtPayload & {
  sub: string
}

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

const isAccessTokenPayload = (payload: string | JwtPayload): payload is AccessTokenPayload =>
  typeof payload !== 'string' && typeof payload.sub === 'string' && payload.sub.length > 0

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

    const userRepository = AppDataSource.getRepository(User)
    const user = await userRepository.findOneBy({ id: payload.sub })

    if (!user || !user.isActive) {
      res.status(401).json({
        status: 'error',
        message: 'User is not authorized'
      })
      return
    }

    req.user = user
    next()
  } catch {
    res.status(401).json({
      status: 'error',
      message: 'Invalid or expired access token'
    })
  }
}
