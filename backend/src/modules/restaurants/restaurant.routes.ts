import { Router } from 'express'

import { authMiddleware } from '../../common/middleware/auth.middleware.js'
import { roleMiddleware } from '../../common/middleware/role.middleware.js'
import { UserRole } from '../users/enums/user-role.enum.js'
import { RestaurantController } from './restaurant.controller.js'
import { RestaurantService } from './restaurant.service.js'

const restaurantsRouter = Router()
const restaurantService = new RestaurantService()
const restaurantController = new RestaurantController(restaurantService)

/**
 * @openapi
 * /restaurants/{id}:
 *   get:
 *     tags:
 *       - Restaurants
 *     summary: Get a single restaurant available to the current user
 *     description: Returns the restaurant for system owners, clients with active OWNER membership, and managers with active MANAGER membership.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Restaurant id
 *     responses:
 *       200:
 *         description: Restaurant fetched successfully
 *       401:
 *         description: Authentication failed
 *       403:
 *         description: Access denied
 *       404:
 *         description: Restaurant not found
 * /restaurants/{id}/users:
 *   get:
 *     tags:
 *       - Restaurants
 *     summary: List restaurant memberships with linked users
 *     description: Returns all memberships for a restaurant with linked user data for system owners and users who already have access to that restaurant.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Restaurant id
 *     responses:
 *       200:
 *         description: Restaurant memberships fetched successfully
 *       401:
 *         description: Authentication failed
 *       403:
 *         description: Access denied
 *       404:
 *         description: Restaurant not found
 * /restaurants/{id}/managers:
 *   post:
 *     tags:
 *       - Restaurants
 *     summary: Assign restaurant manager
 *     description: Creates a MANAGER restaurant membership. Only system owners or restaurant owners can assign managers.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Restaurant id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Manager assigned successfully
 *       400:
 *         description: Invalid request payload
 *       401:
 *         description: Authentication failed
 *       403:
 *         description: Access denied
 *       404:
 *         description: Restaurant or user not found
 *       409:
 *         description: User is inactive or already has a membership
 * /restaurants/{id}/managers/{userId}:
 *   delete:
 *     tags:
 *       - Restaurants
 *     summary: Remove restaurant manager
 *     description: Removes a MANAGER restaurant membership. Only system owners or restaurant owners can remove managers.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Restaurant id
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     responses:
 *       204:
 *         description: Manager removed successfully
 *       401:
 *         description: Authentication failed
 *       403:
 *         description: Access denied
 *       404:
 *         description: Restaurant or membership not found
 *       409:
 *         description: Membership is not a manager membership
 * /restaurants:
 *   get:
 *     tags:
 *       - Restaurants
 *     summary: List restaurants available to the current user
 *     description: Returns all restaurants for system owners, restaurants with active OWNER membership for clients, and restaurants with active MANAGER membership for managers. Active memberships are used by default.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: includeInactiveMemberships
 *         required: false
 *         schema:
 *           type: boolean
 *         description: When true, CLIENT and MANAGER users can also receive restaurants from inactive memberships.
 *     responses:
 *       200:
 *         description: Restaurants fetched successfully
 *       401:
 *         description: Authentication failed
 *       403:
 *         description: Access denied
 *   post:
 *     tags:
 *       - Restaurants
 *     summary: Create restaurant
 *     description: Creates a restaurant for the current authenticated client or owner and assigns OWNER membership to that user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - slug
 *               - phone
 *               - address
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               description:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phones:
 *                 type: array
 *                 items:
 *                   type: string
 *               city:
 *                 type: string
 *               logo:
 *                 type: string
 *               preview:
 *                 type: string
 *               deliveryTime:
 *                 type: integer
 *               deliveryConditions:
 *                 type: string
 *               cuisine:
 *                 type: array
 *                 items:
 *                   type: string
 *               workSchedule:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - day
 *                     - open
 *                     - close
 *                   properties:
 *                     day:
 *                       type: string
 *                     open:
 *                       type: string
 *                     close:
 *                       type: string
 *     responses:
 *       201:
 *         description: Restaurant created successfully
 *       400:
 *         description: Invalid request payload
 *       401:
 *         description: Authentication failed
 *       403:
 *         description: Access denied
 *       409:
 *         description: Restaurant slug already exists
 */
restaurantsRouter.get(
  '/:id',
  authMiddleware,
  roleMiddleware([UserRole.OWNER, UserRole.CLIENT, UserRole.MANAGER]),
  restaurantController.getById
)

restaurantsRouter.get(
  '/:id/users',
  authMiddleware,
  roleMiddleware([UserRole.OWNER, UserRole.CLIENT, UserRole.MANAGER]),
  restaurantController.getUsers
)

restaurantsRouter.post(
  '/:id/managers',
  authMiddleware,
  roleMiddleware([UserRole.OWNER, UserRole.CLIENT]),
  restaurantController.assignManager
)

restaurantsRouter.delete(
  '/:id/managers/:userId',
  authMiddleware,
  roleMiddleware([UserRole.OWNER, UserRole.CLIENT]),
  restaurantController.removeManager
)

restaurantsRouter.get(
  '/',
  authMiddleware,
  roleMiddleware([UserRole.OWNER, UserRole.CLIENT, UserRole.MANAGER]),
  restaurantController.list
)

restaurantsRouter.post(
  '/',
  authMiddleware,
  roleMiddleware([UserRole.CLIENT, UserRole.OWNER]),
  restaurantController.create
)

export { restaurantsRouter }
