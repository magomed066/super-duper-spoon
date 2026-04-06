import { Column } from 'typeorm'

/**
 * Multi-restaurant architecture rule:
 * every restaurant-scoped business entity must persist `restaurantId` as a first-class column.
 *
 * This contract is the default base for future restaurant-scoped modules, including:
 * - menu
 * - menu categories
 * - menu items
 * - orders
 * - reservations
 * - employees
 * - analytics records
 *
 * Do not infer restaurant ownership only through nested relations such as
 * `menu -> category -> item` or `order -> reservation -> restaurant`.
 * Each restaurant-scoped table must be directly filterable by `restaurantId`
 * so authorization, indexing, reporting, and data migrations stay predictable.
 */
export abstract class RestaurantScopedEntity {
  @Column({ type: 'uuid' })
  restaurantId!: string
}
