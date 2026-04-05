import {
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
  hashEmail,
  hashPhone
} from '../../../common/utils/encryption.js'
import { RefreshToken } from '../../auth/entities/refresh-token.entity.js'
import { UserRole } from '../enums/user-role.enum.js'

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 255 })
  firstName!: string

  @Column({ type: 'varchar', length: 255 })
  lastName!: string

  @Column({ type: 'varchar', length: 512 })
  phone!: string

  @Column({ type: 'varchar', length: 512 })
  email!: string

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

  @BeforeInsert()
  @BeforeUpdate()
  protectSensitiveFields(): void {
    this.email = hashEmail(this.email)
    this.phone = hashPhone(this.phone)
  }
}
