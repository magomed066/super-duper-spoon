import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm'

import {
  hashAddress,
  hashEmail,
  hashPhone
} from '../../../common/utils/encryption.js'
import { ApplicationStatus } from '../enums/application-status.enum.js'

@Entity({ name: 'applications' })
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 512 })
  email!: string

  @Column({ type: 'varchar', length: 255 })
  name!: string

  @Column({ type: 'varchar', length: 255 })
  restaurantName!: string

  @Column({ type: 'varchar', length: 512 })
  address!: string

  @Column({ type: 'varchar', length: 512 })
  phone!: string

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING
  })
  status!: ApplicationStatus

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date

  @BeforeInsert()
  @BeforeUpdate()
  protectSensitiveFields(): void {
    this.email = hashEmail(this.email)
    this.phone = hashPhone(this.phone)
    this.address = hashAddress(this.address)
  }
}
