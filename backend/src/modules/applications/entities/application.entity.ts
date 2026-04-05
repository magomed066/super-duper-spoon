import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm'

import { ApplicationStatus } from '../enums/application-status.enum.js'

@Entity({ name: 'applications' })
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 255 })
  email!: string

  @Column({ type: 'varchar', length: 255 })
  name!: string

  @Column({ type: 'varchar', length: 255 })
  restaurantName!: string

  @Column({ type: 'varchar', length: 255 })
  address!: string

  @Column({ type: 'varchar', length: 255 })
  phone!: string

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING
  })
  status!: ApplicationStatus

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date
}
