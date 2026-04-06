import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm'

import {
  decryptAddress,
  decryptEmail,
  decryptPhone,
  encryptAddress,
  encryptEmail,
  encryptPhone,
  hashAddress,
  hashEmail,
  hashPhone
} from '../../../common/utils/encryption.js'
import { ApplicationStatus } from '../enums/application-status.enum.js'

@Entity({ name: 'applications' })
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'text' })
  email!: string

  @Column({ type: 'varchar', length: 64 })
  emailHash!: string

  @Column({ type: 'varchar', length: 255 })
  name!: string

  @Column({ type: 'varchar', length: 255 })
  restaurantName!: string

  @Column({ type: 'text' })
  address!: string

  @Column({ type: 'varchar', length: 64 })
  addressHash!: string

  @Column({ type: 'text' })
  phone!: string

  @Column({ type: 'varchar', length: 64 })
  phoneHash!: string

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
    this.emailHash = hashEmail(this.email)
    this.addressHash = hashAddress(this.address)
    this.phoneHash = hashPhone(this.phone)
    this.email = encryptEmail(this.email)
    this.phone = encryptPhone(this.phone)
    this.address = encryptAddress(this.address)
  }

  @AfterLoad()
  unprotectSensitiveFields(): void {
    this.email = decryptEmail(this.email)
    this.phone = decryptPhone(this.phone)
    this.address = decryptAddress(this.address)
  }
}
