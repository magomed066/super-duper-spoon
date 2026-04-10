import { Router } from 'express'

import { validateRequestParams } from '../../common/middleware/zod-validation.middleware.js'
import { restaurantMenuParamsSchema } from './dto/menu-route-params.dto.js'
import { MenuController } from './menu.controller.js'
import { MenuService } from './menu.service.js'

const menuRouter = Router()
const menuService = new MenuService()
const menuController = new MenuController(menuService)

/**
 * @openapi
 * /restaurants/public/{restaurantId}/menu:
 *   get:
 *     tags:
 *       - Menu
 *     summary: Get a public restaurant menu
 *     description: Returns the public menu for a restaurant only when the restaurant itself is publicly visible and only includes active categories and active items.
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
 *         description: Restaurant menu fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RestaurantMenuReadModel'
 *       400:
 *         description: Missing or invalid restaurant id
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
 *         description: Restaurant exists but is not publicly available
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
menuRouter.get(
  '/restaurants/public/:restaurantId/menu',
  validateRequestParams(restaurantMenuParamsSchema),
  menuController.getPublicRestaurantMenu
)

export { menuRouter }
