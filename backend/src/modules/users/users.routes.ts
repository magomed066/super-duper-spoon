import { Router } from 'express'

import { authMiddleware } from '../../common/middleware/auth.middleware.js'
import { roleMiddleware } from '../../common/middleware/role.middleware.js'
import { UserRole } from './enums/user-role.enum.js'
import { UsersController } from './users.controller.js'
import { UsersService } from './users.service.js'

const usersRouter = Router()
const usersService = new UsersService()
const usersController = new UsersController(usersService)

/**
 * @openapi
 * /users/{id}/block:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Block user
 *     description: OWNER-only endpoint that sets `isActive` to `false` for the target user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *     responses:
 *       200:
 *         description: User was blocked successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Authentication failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Access denied or blocked user action
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
usersRouter.patch(
  '/:id/block',
  authMiddleware,
  roleMiddleware([UserRole.OWNER]),
  usersController.block
)

/**
 * @openapi
 * /users/{id}/unblock:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Unblock user
 *     description: OWNER-only endpoint that sets `isActive` to `true` for the target user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *     responses:
 *       200:
 *         description: User was unblocked successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Authentication failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Access denied
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
usersRouter.patch(
  '/:id/unblock',
  authMiddleware,
  roleMiddleware([UserRole.OWNER]),
  usersController.unblock
)

export { usersRouter }
