import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'
import type { Relation } from 'typeorm'

import {
  decryptEmail,
  decryptPhone,
  encryptEmail,
  encryptPhone,
  hashEmail,
  hashPhone
} from '../../../common/utils/encryption.js'
import { RefreshToken } from '../../auth/entities/refresh-token.entity.js'
import { RestaurantUser } from '../../restaurants/entities/restaurant-user.entity.js'
import { UserRole } from '../enums/user-role.enum.js'

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 255 })
  firstName!: string

  @Column({ type: 'varchar', length: 255 })
  lastName!: string

  @Column({ type: 'text' })
  phone!: string

  @Column({ type: 'varchar', length: 64 })
  phoneHash!: string

  @Column({ type: 'text' })
  email!: string

  @Column({ type: 'varchar', length: 64, unique: true })
  emailHash!: string

  @Column({ type: 'varchar', length: 255 })
  password!: string

  @Column({ type: 'varchar', length: 50 })
  status!: string

  @Column({
    type: 'enum',
    enum: UserRole
  })
  role!: UserRole

  @Column({ type: 'boolean', default: true })
  isActive!: boolean

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens!: Relation<RefreshToken[]>

  @OneToMany(() => RestaurantUser, (restaurantUser) => restaurantUser.user)
  restaurantUsers!: Relation<RestaurantUser[]>

  @BeforeInsert()
  @BeforeUpdate()
  protectSensitiveFields(): void {
    this.emailHash = hashEmail(this.email)
    this.phoneHash = hashPhone(this.phone)
    this.email = encryptEmail(this.email)
    this.phone = encryptPhone(this.phone)
  }

  @AfterLoad()
  unprotectSensitiveFields(): void {
    this.email = decryptEmail(this.email)
    this.phone = decryptPhone(this.phone)
  }
}
