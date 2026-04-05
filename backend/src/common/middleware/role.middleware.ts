import type { NextFunction, Request, Response } from 'express'

import type { UserRole } from '../../modules/users/enums/user-role.enum.js'

export const roleMiddleware = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        status: 'error',
        message: 'User is not authenticated'
      })
      return
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        status: 'error',
        message: 'Access denied'
      })
      return
    }

    next()
  }
}
