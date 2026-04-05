import { Router } from 'express'

import { authMiddleware } from '../../common/middleware/auth.middleware.js'
import { roleMiddleware } from '../../common/middleware/role.middleware.js'
import { UserRole } from '../users/enums/user-role.enum.js'
import { ApplicationsController } from './applications.controller.js'
import { ApplicationsService } from './applications.service.js'

const applicationsRouter = Router()
const applicationsService = new ApplicationsService()
const applicationsController = new ApplicationsController(applicationsService)

/**
 * @openapi
 * /applications:
 *   post:
 *     tags:
 *       - Applications
 *     summary: Create restaurant application
 *     description: Public endpoint for submitting a new restaurant application.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateApplicationRequest'
 *     responses:
 *       201:
 *         description: Application created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Application'
 *       400:
 *         description: Invalid request payload
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Application already exists or cannot be created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
applicationsRouter.post('/', applicationsController.create)

/**
 * @openapi
 * /applications:
 *   get:
 *     tags:
 *       - Applications
 *     summary: List restaurant applications
 *     description: OWNER-only endpoint that returns all submitted applications.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Applications fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Application'
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
 */
applicationsRouter.get(
  '/',
  authMiddleware,
  roleMiddleware([UserRole.OWNER]),
  applicationsController.list
)

/**
 * @openapi
 * /applications/{id}/approve:
 *   post:
 *     tags:
 *       - Applications
 *     summary: Approve application
 *     description: OWNER-only endpoint that approves a pending application and returns generated credentials.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Application ID
 *     responses:
 *       200:
 *         description: Application approved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApprovalResult'
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
 *         description: Application not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Application cannot be approved in its current state
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
applicationsRouter.post(
  '/:id/approve',
  authMiddleware,
  roleMiddleware([UserRole.OWNER]),
  applicationsController.approve
)

/**
 * @openapi
 * /applications/{id}/reject:
 *   post:
 *     tags:
 *       - Applications
 *     summary: Reject application
 *     description: OWNER-only endpoint that rejects a pending application.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Application ID
 *     responses:
 *       200:
 *         description: Application rejected successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Application'
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
 *         description: Application not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Application cannot be rejected in its current state
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
applicationsRouter.post(
  '/:id/reject',
  authMiddleware,
  roleMiddleware([UserRole.OWNER]),
  applicationsController.reject
)

export { applicationsRouter }
