import {
  Column,
  CreateDateColumn,
  Entity,
  Unique,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import type { Relation } from 'typeorm'

import { RestaurantScopedEntity } from '../../../common/restaurant-scope/restaurant-scoped.entity.js'
import { MenuItem } from '../../menu-items/entities/menu-item.entity.js'
import { Restaurant } from '../../restaurants/entities/restaurant.entity.js'

@Entity({ name: 'menu_categories' })
@Unique('UQ_menu_categories_id_restaurantId', ['id', 'restaurantId'])
export class MenuCategory extends RestaurantScopedEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 255 })
  name!: string

  @Column({ type: 'text', nullable: true })
  description!: string | null

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

  @OneToMany(() => MenuItem, (menuItem) => menuItem.category)
  items!: Relation<MenuItem[]>
}
