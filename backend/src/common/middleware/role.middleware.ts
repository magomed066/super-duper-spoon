import type { NextFunction, Request, Response } from 'express'

import { UserRole } from '../../modules/users/enums/user-role.enum.js'

const GLOBAL_SYSTEM_ROLES = [
  UserRole.SYSTEM_OWNER,
  UserRole.CLIENT,
  UserRole.STAFF
] as const satisfies readonly UserRole[]

type GlobalSystemRole = (typeof GLOBAL_SYSTEM_ROLES)[number]

const globalSystemRoleSet = new Set<GlobalSystemRole>(GLOBAL_SYSTEM_ROLES)

const isGlobalSystemRole = (role: UserRole): role is GlobalSystemRole =>
  globalSystemRoleSet.has(role as GlobalSystemRole)

export const roleMiddleware = (allowedRoles: readonly GlobalSystemRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        status: 'error',
        message: 'User is not authenticated'
      })
      return
    }

    if (!isGlobalSystemRole(req.user.role) || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        status: 'error',
        message: 'Access denied'
      })
      return
    }

    next()
  }
}
