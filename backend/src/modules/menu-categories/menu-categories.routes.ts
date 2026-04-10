import { Router } from 'express'

import { authMiddleware } from '../../common/middleware/auth.middleware.js'
import {
  validateRequestBody,
  validateRequestParams
} from '../../common/middleware/zod-validation.middleware.js'
import {
  restaurantMenuCategoryParamsSchema,
  restaurantMenuParamsSchema
} from '../menu/dto/menu-route-params.dto.js'
import { createMenuCategorySchema } from './dto/create-menu-category.dto.js'
import { reorderMenuCategoriesSchema } from './dto/reorder-menu-categories.dto.js'
import { updateMenuCategorySchema } from './dto/update-menu-category.dto.js'
import { MenuCategoriesController } from './menu-categories.controller.js'
import { MenuCategoriesService } from './menu-categories.service.js'

const menuCategoriesRouter = Router()
const menuCategoriesService = new MenuCategoriesService()
const menuCategoriesController = new MenuCategoriesController(menuCategoriesService)

/**
 * @openapi
 * /restaurants/{restaurantId}/categories:
 *   post:
 *     tags:
 *       - Menu Categories
 *     summary: Create a menu category
 *     description: Creates a menu category for the specified restaurant. Access is limited to system owners and eligible restaurant members who can mutate the restaurant menu. The sort order is assigned automatically to the next available position.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Restaurant id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMenuCategoryRequest'
 *     responses:
 *       201:
 *         description: Menu category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuCategory'
 *       400:
 *         description: Invalid request payload or missing identifiers
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
 *         description: Menu mutation is not allowed for the restaurant in its current state
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   get:
 *     tags:
 *       - Menu Categories
 *     summary: List menu categories for a restaurant
 *     description: Returns all menu categories visible to the current authenticated actor for the specified restaurant.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Restaurant id
 *     responses:
 *       200:
 *         description: Menu categories fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MenuCategory'
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
 *         description: Restaurant exists but is unavailable to the current actor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * /restaurants/{restaurantId}/categories/reorder:
 *   patch:
 *     tags:
 *       - Menu Categories
 *     summary: Reorder menu categories
 *     description: Updates category sortOrder values for the specified restaurant based on the provided ordered list of category ids.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Restaurant id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - categoryIds
 *             properties:
 *               categoryIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 description: Full ordered list of category ids for the restaurant
 *     responses:
 *       200:
 *         description: Menu categories reordered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MenuCategory'
 *       400:
 *         description: Invalid payload or incomplete category id set
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
 *         description: Menu mutation is not allowed for the restaurant in its current state
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * /restaurants/{restaurantId}/categories/{categoryId}:
 *   patch:
 *     tags:
 *       - Menu Categories
 *     summary: Update a menu category
 *     description: Updates a menu category belonging to the specified restaurant.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Restaurant id
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Menu category id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMenuCategoryRequest'
 *     responses:
 *       200:
 *         description: Menu category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuCategory'
 *       400:
 *         description: Invalid request payload or missing identifiers
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
 *         description: Restaurant or category not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Category does not belong to the restaurant or menu mutation is not allowed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     tags:
 *       - Menu Categories
 *     summary: Delete a menu category
 *     description: Deletes an empty menu category belonging to the specified restaurant.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Restaurant id
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Menu category id
 *     responses:
 *       204:
 *         description: Menu category deleted successfully
 *       400:
 *         description: Missing identifiers
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
 *         description: Restaurant or category not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Category still has items, does not belong to the restaurant, or menu mutation is not allowed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
menuCategoriesRouter.post(
  '/restaurants/:restaurantId/categories',
  authMiddleware,
  validateRequestParams(restaurantMenuParamsSchema),
  validateRequestBody(createMenuCategorySchema),
  menuCategoriesController.create
)

menuCategoriesRouter.get(
  '/restaurants/:restaurantId/categories',
  authMiddleware,
  validateRequestParams(restaurantMenuParamsSchema),
  menuCategoriesController.listByRestaurant
)

menuCategoriesRouter.patch(
  '/restaurants/:restaurantId/categories/reorder',
  authMiddleware,
  validateRequestParams(restaurantMenuParamsSchema),
  validateRequestBody(reorderMenuCategoriesSchema),
  menuCategoriesController.reorder
)

menuCategoriesRouter.patch(
  '/restaurants/:restaurantId/categories/:categoryId',
  authMiddleware,
  validateRequestParams(restaurantMenuCategoryParamsSchema),
  validateRequestBody(updateMenuCategorySchema),
  menuCategoriesController.update
)

menuCategoriesRouter.delete(
  '/restaurants/:restaurantId/categories/:categoryId',
  authMiddleware,
  validateRequestParams(restaurantMenuCategoryParamsSchema),
  menuCategoriesController.delete
)

export { menuCategoriesRouter }
