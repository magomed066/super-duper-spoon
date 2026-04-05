import { Router } from 'express'

import { authMiddleware } from '../../common/middleware/auth.middleware.js'
import { roleMiddleware } from '../../common/middleware/role.middleware.js'
import { UserRole } from '../users/enums/user-role.enum.js'
import { ApplicationsController } from './applications.controller.js'
import { ApplicationsService } from './applications.service.js'

const applicationsRouter = Router()
const applicationsService = new ApplicationsService()
const applicationsController = new ApplicationsController(applicationsService)

applicationsRouter.post('/', applicationsController.create)
applicationsRouter.get(
  '/',
  authMiddleware,
  roleMiddleware([UserRole.OWNER]),
  applicationsController.list
)
applicationsRouter.post(
  '/:id/approve',
  authMiddleware,
  roleMiddleware([UserRole.OWNER]),
  applicationsController.approve
)
applicationsRouter.post(
  '/:id/reject',
  authMiddleware,
  roleMiddleware([UserRole.OWNER]),
  applicationsController.reject
)

export { applicationsRouter }
