import { Router } from 'express'

import { authMiddleware } from '../../common/middleware/auth.middleware.js'
import {
  menuItemImageUpload,
} from '../../common/uploads/file-storage.js'
import {
  validateRequestBody,
  validateRequestParams
} from '../../common/middleware/zod-validation.middleware.js'
import {
  restaurantMenuItemParamsSchema,
  restaurantMenuParamsSchema
} from '../menu/dto/menu-route-params.dto.js'
import { createMenuItemSchema } from './dto/create-menu-item.dto.js'
import { updateMenuItemSchema } from './dto/update-menu-item.dto.js'
import { MenuItemsController } from './menu-items.controller.js'
import { MenuItemsService } from './menu-items.service.js'

const menuItemsRouter = Router()
const menuItemsService = new MenuItemsService()
const menuItemsController = new MenuItemsController(menuItemsService)

/**
 * @openapi
 * /restaurants/{restaurantId}/items:
 *   post:
 *     tags:
 *       - Menu Items
 *     summary: Create a menu item
 *     description: Creates a menu item for the specified restaurant. Access is limited to system owners and eligible restaurant members who can mutate the restaurant menu.
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
 *             $ref: '#/components/schemas/CreateMenuItemRequest'
 *     responses:
 *       201:
 *         description: Menu item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuItem'
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
 *   get:
 *     tags:
 *       - Menu Items
 *     summary: List menu items for a restaurant
 *     description: Returns all menu items visible to the current authenticated actor for the specified restaurant.
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
 *         description: Menu items fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MenuItem'
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
 * /restaurants/{restaurantId}/items/{itemId}:
 *   patch:
 *     tags:
 *       - Menu Items
 *     summary: Update a menu item
 *     description: Updates a menu item belonging to the specified restaurant.
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
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Menu item id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMenuItemRequest'
 *     responses:
 *       200:
 *         description: Menu item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuItem'
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
 *         description: Restaurant, item, or category not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Item or category does not belong to the restaurant, or menu mutation is not allowed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     tags:
 *       - Menu Items
 *     summary: Delete a menu item
 *     description: Permanently deletes a menu item belonging to the specified restaurant.
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
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Menu item id
 *     responses:
 *       204:
 *         description: Menu item deleted successfully
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
 *         description: Restaurant or item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Item does not belong to the restaurant or menu mutation is not allowed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
menuItemsRouter.post(
  '/restaurants/:restaurantId/items',
  authMiddleware,
  validateRequestParams(restaurantMenuParamsSchema),
  menuItemImageUpload.single('imageFile'),
  validateRequestBody(createMenuItemSchema),
  menuItemsController.create
)

menuItemsRouter.get(
  '/restaurants/:restaurantId/items',
  authMiddleware,
  validateRequestParams(restaurantMenuParamsSchema),
  menuItemsController.listByRestaurant
)

menuItemsRouter.patch(
  '/restaurants/:restaurantId/items/:itemId',
  authMiddleware,
  validateRequestParams(restaurantMenuItemParamsSchema),
  menuItemImageUpload.single('imageFile'),
  validateRequestBody(updateMenuItemSchema),
  menuItemsController.update
)

menuItemsRouter.delete(
  '/restaurants/:restaurantId/items/:itemId',
  authMiddleware,
  validateRequestParams(restaurantMenuItemParamsSchema),
  menuItemsController.delete
)

export { menuItemsRouter }
