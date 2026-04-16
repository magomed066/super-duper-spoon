import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import type { Relation } from 'typeorm'

import { RestaurantScopedEntity } from '../../../common/restaurant-scope/restaurant-scoped.entity.js'
import { MenuCategory } from '../../menu-categories/entities/menu-category.entity.js'
import { Restaurant } from '../../restaurants/entities/restaurant.entity.js'

@Entity({ name: 'menu_items' })
export class MenuItem extends RestaurantScopedEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'uuid' })
  categoryId!: string

  @Column({ type: 'varchar', length: 255 })
  name!: string

  @Column({ type: 'text', nullable: true })
  description!: string | null

  // Price is stored in whole rubles.
  @Column({ type: 'integer' })
  price!: number

  @Column({ type: 'text', nullable: true })
  image!: string | null

  @Column({ type: 'boolean', default: true })
  isActive!: boolean

  @Column({ type: 'integer', default: 0 })
  sortOrder!: number

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date

  @ManyToOne(() => Restaurant, {
    nullable: false,
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'restaurantId' })
  restaurant!: Relation<Restaurant>

  @ManyToOne(() => MenuCategory, (menuCategory) => menuCategory.items, {
    nullable: false,
    onDelete: 'RESTRICT'
  })
  @JoinColumn([
    { name: 'categoryId', referencedColumnName: 'id' },
    { name: 'restaurantId', referencedColumnName: 'restaurantId' }
  ])
  category!: Relation<MenuCategory>
}
