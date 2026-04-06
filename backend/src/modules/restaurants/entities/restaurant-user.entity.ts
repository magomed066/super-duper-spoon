import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique
} from 'typeorm'
import type { Relation } from 'typeorm'

import { RestaurantScopedEntity } from '../../../common/restaurant-scope/index.js'
import { User } from '../../users/entities/user.entity.js'
import { RestaurantMembershipRole } from '../enums/restaurant-membership-role.enum.js'
import { Restaurant } from './restaurant.entity.js'

@Entity({ name: 'restaurant_users' })
@Unique(['restaurantId', 'userId'])
export class RestaurantUser extends RestaurantScopedEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'uuid' })
  userId!: string

  @Column({
    type: 'enum',
    enum: RestaurantMembershipRole
  })
  role!: RestaurantMembershipRole

  @Column({ type: 'boolean', default: true })
  isActive!: boolean

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.restaurantUsers, {
    nullable: false
  })
  @JoinColumn({ name: 'restaurantId' })
  restaurant!: Relation<Restaurant>

  @ManyToOne(() => User, (user) => user.restaurantUsers, {
    nullable: false
  })
  @JoinColumn({ name: 'userId' })
  user!: Relation<User>
}
