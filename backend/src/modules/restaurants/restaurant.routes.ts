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
 * /restaurants:
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
restaurantsRouter.post(
  '/',
  authMiddleware,
  roleMiddleware([UserRole.CLIENT, UserRole.OWNER]),
  restaurantController.create
)

export { restaurantsRouter }
