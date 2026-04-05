import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'

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

  @Column({ type: 'varchar', length: 30 })
  phone!: string

  @Column({ type: 'varchar', length: 255, unique: true })
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
  refreshTokens!: RefreshToken[]
}
