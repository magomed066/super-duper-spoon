import { Router } from 'express'

import { authMiddleware } from '../../common/middleware/auth.middleware.js'
import { roleMiddleware } from '../../common/middleware/role.middleware.js'
import {
  PLATFORM_USER_ROLES,
  RESTAURANT_CREATION_PLATFORM_ROLES
} from '../../common/rbac/index.js'
import { restaurantMediaUpload } from '../../common/uploads/file-storage.js'
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
 *     description: Returns the restaurant for system owners and users with an active restaurant membership.
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
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
 *         description: Restaurant not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   patch:
 *     tags:
 *       - Restaurants
 *     summary: Update a restaurant
 *     description: System owners can update any restaurant. Restaurant owners and managers can update restaurants they belong to.
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
 *             $ref: '#/components/schemas/UpdateRestaurantRequest'
 *     responses:
 *       200:
 *         description: Restaurant updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 *       400:
 *         description: Invalid request payload
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 *         description: Restaurant not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Restaurant slug already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     tags:
 *       - Restaurants
 *     summary: Delete a restaurant
 *     description: System owners can delete any restaurant. Clients can delete only restaurants they own. Staff cannot delete restaurants.
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
 *       204:
 *         description: Restaurant deleted successfully
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
 *         description: Restaurant not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * /restaurants/{id}/users:
 *   get:
 *     tags:
 *       - Restaurants
 *     summary: List restaurant memberships with linked users
 *     description: Returns all memberships for a restaurant with linked user data for system owners and users who already have access to that restaurant through RestaurantUser.role.
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RestaurantMembership'
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
 *         description: Restaurant not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 *             $ref: '#/components/schemas/AssignRestaurantManagerRequest'
 *     responses:
 *       201:
 *         description: Manager assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RestaurantMembership'
 *       200:
 *         description: Existing membership promoted to manager successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RestaurantMembership'
 *       400:
 *         description: Invalid request payload
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 *         description: Restaurant or user not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: User is inactive or already has a membership
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 *         description: Restaurant or membership not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Membership is not a manager membership
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * /restaurants:
 *   get:
 *     tags:
 *       - Restaurants
 *     summary: List restaurants available to the current user
 *     description: Returns all restaurants for system owners and restaurants with active memberships for the current user. Active memberships are used by default.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: includeInactiveMemberships
 *         required: false
 *         schema:
 *           type: boolean
 *         description: When true, non-system users can also receive restaurants from inactive memberships.
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for paginated restaurant list.
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         description: Number of restaurants returned per page.
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Full-text style search across name, slug, city, email, phone, address, and description.
 *       - in: query
 *         name: name
 *         required: false
 *         schema:
 *           type: string
 *         description: Partial restaurant name filter.
 *       - in: query
 *         name: city
 *         required: false
 *         schema:
 *           type: string
 *         description: Partial city filter.
 *       - in: query
 *         name: slug
 *         required: false
 *         schema:
 *           type: string
 *         description: Partial slug filter.
 *       - in: query
 *         name: isActive
 *         required: false
 *         schema:
 *           type: boolean
 *         description: Filter restaurants by active status.
 *     responses:
 *       200:
 *         description: Restaurants fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedRestaurantsResponse'
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
 *   post:
 *     tags:
 *       - Restaurants
 *     summary: Create restaurant
 *     description: Creates a restaurant for the current authenticated client or system owner. Restaurant-specific OWNER membership is assigned only at restaurant creation time.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateRestaurantRequest'
 *     responses:
 *       201:
 *         description: Restaurant created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateRestaurantResponse'
 *       400:
 *         description: Invalid request payload
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 *       409:
 *         description: Restaurant slug already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
restaurantsRouter.get(
  '/:id',
  authMiddleware,
  roleMiddleware(PLATFORM_USER_ROLES),
  restaurantController.getById
)

restaurantsRouter.patch(
  '/:id',
  authMiddleware,
  roleMiddleware(PLATFORM_USER_ROLES),
  restaurantController.update
)

restaurantsRouter.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(PLATFORM_USER_ROLES),
  restaurantController.delete
)

restaurantsRouter.get(
  '/:id/users',
  authMiddleware,
  roleMiddleware(PLATFORM_USER_ROLES),
  restaurantController.getUsers
)

restaurantsRouter.post(
  '/:id/managers',
  authMiddleware,
  roleMiddleware(PLATFORM_USER_ROLES),
  restaurantController.assignManager
)

restaurantsRouter.delete(
  '/:id/managers/:userId',
  authMiddleware,
  roleMiddleware(PLATFORM_USER_ROLES),
  restaurantController.removeManager
)

restaurantsRouter.get(
  '/',
  authMiddleware,
  roleMiddleware(PLATFORM_USER_ROLES),
  restaurantController.list
)

restaurantsRouter.post(
  '/',
  authMiddleware,
  roleMiddleware(RESTAURANT_CREATION_PLATFORM_ROLES),
  restaurantMediaUpload.fields([
    { name: 'logoFile', maxCount: 1 },
    { name: 'previewFile', maxCount: 1 }
  ]),
  restaurantController.create
)

export { restaurantsRouter }
