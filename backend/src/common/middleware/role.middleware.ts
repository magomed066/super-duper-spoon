import type { NextFunction, Request, Response } from 'express'

import {
  hasPlatformRole,
  type PlatformUserRole
} from '../rbac/index.js'

export const roleMiddleware = (allowedRoles: readonly PlatformUserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        status: 'error',
        message: 'User is not authenticated'
      })
      return
    }

    if (!hasPlatformRole(req.user.role, allowedRoles)) {
      res.status(403).json({
        status: 'error',
        message: 'Access denied'
      })
      return
    }

    next()
  }
}
