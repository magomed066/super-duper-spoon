import { Router } from 'express'

import { authMiddleware } from '../../common/middleware/auth.middleware.js'
import { roleMiddleware } from '../../common/middleware/role.middleware.js'
import { UserRole } from './enums/user-role.enum.js'
import { UsersController } from './users.controller.js'
import { UsersService } from './users.service.js'

const usersRouter = Router()
const usersService = new UsersService()
const usersController = new UsersController(usersService)

usersRouter.patch(
  '/:id/block',
  authMiddleware,
  roleMiddleware([UserRole.OWNER]),
  usersController.block
)

usersRouter.patch(
  '/:id/unblock',
  authMiddleware,
  roleMiddleware([UserRole.OWNER]),
  usersController.unblock
)

export { usersRouter }
