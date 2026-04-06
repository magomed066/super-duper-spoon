import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import type { Relation } from 'typeorm'

import { RestaurantUser } from './restaurant-user.entity.js'

export interface RestaurantWorkScheduleItem {
  day: string
  open: string
  close: string
}

@Entity({ name: 'restaurants' })
export class Restaurant {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 255 })
  name!: string

  @Column({ type: 'varchar', length: 255, unique: true })
  slug!: string

  @Column('text', { array: true, default: () => "'{}'" })
  cuisine!: string[]

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string

  @Column('text', { array: true, default: () => "'{}'" })
  phones!: string[]

  @Column({ type: 'varchar', length: 255 })
  city!: string

  @Column({ type: 'varchar', length: 500 })
  logo!: string

  @Column({ type: 'varchar', length: 500 })
  preview!: string

  @Column({ type: 'jsonb', default: () => "'[]'" })
  workSchedule!: RestaurantWorkScheduleItem[]

  @Column({ type: 'integer' })
  deliveryTime!: number

  @Column({ type: 'text' })
  deliveryConditions!: string

  @Column({ type: 'text', nullable: true })
  description!: string | null

  @Column({ type: 'varchar', length: 255, nullable: true })
  phone!: string | null

  @Column({ type: 'text', nullable: true })
  address!: string | null

  @Column({ type: 'boolean', default: true })
  isActive!: boolean

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date

  @OneToMany(() => RestaurantUser, (membership) => membership.restaurant)
  memberships!: Relation<RestaurantUser[]>

  get restaurantUsers(): Relation<RestaurantUser[]> {
    return this.memberships
  }

  set restaurantUsers(value: Relation<RestaurantUser[]>) {
    this.memberships = value
  }
}
