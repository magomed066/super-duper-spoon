import bcrypt from 'bcrypt'
import { randomBytes } from 'node:crypto'
import { Repository } from 'typeorm'

import {
  decryptAddress,
  decryptEmail,
  decryptPhone,
  hashEmail
} from '../../common/utils/encryption.js'
import { AppDataSource } from '../../database/data-source.js'
import { isValidEmail } from '../../helpers/utils.js'
import { User } from '../users/entities/user.entity.js'
import { UserRole } from '../users/enums/user-role.enum.js'
import { Application } from './entities/application.entity.js'
import { ApplicationStatus } from './enums/application-status.enum.js'
import {
  ApprovalResult,
  ApplicationDto,
  CreateApplicationDto
} from './types/applications.controller.types.js'

export class ApplicationsHttpError extends Error {
  constructor(public readonly statusCode: number, message: string) {
    super(message)
    this.name = 'ApplicationsHttpError'
  }
}

export class ApplicationsService {
  private readonly applicationRepository: Repository<Application>

  private readonly userRepository: Repository<User>

  constructor() {
    this.applicationRepository = AppDataSource.getRepository(Application)
    this.userRepository = AppDataSource.getRepository(User)
  }

  async createApplication(
    payload: CreateApplicationDto
  ): Promise<ApplicationDto> {
    const normalizedPayload = this.validateCreatePayload(payload)
    const hashedEmail = hashEmail(normalizedPayload.email)

    const existingUser = await this.userRepository.findOne({
      where: { emailHash: hashedEmail }
    })

    if (existingUser) {
      throw new ApplicationsHttpError(409, 'Email is already in use')
    }

    const existingPendingApplication = await this.applicationRepository.findOne(
      {
        where: {
          emailHash: hashedEmail,
          status: ApplicationStatus.PENDING
        }
      }
    )

    if (existingPendingApplication) {
      throw new ApplicationsHttpError(
        409,
        'A pending application already exists for this email'
      )
    }

    const existingApplication = await this.applicationRepository.findOne({
      where: { emailHash: hashedEmail }
    })

    if (existingApplication) {
      throw new ApplicationsHttpError(409, 'Email is already in use')
    }

    const application = await this.applicationRepository.save(
      this.applicationRepository.create(normalizedPayload)
    )

    return this.toApplicationDto(application)
  }

  async listApplications(): Promise<ApplicationDto[]> {
    const applications = await this.applicationRepository.find({
      order: {
        createdAt: 'DESC'
      }
    })

    return applications.map((application) => this.toApplicationDto(application))
  }

  async approveApplication(id: string): Promise<ApprovalResult> {
    const application = await this.getApplicationOrThrow(id)

    if (application.status !== ApplicationStatus.PENDING) {
      throw new ApplicationsHttpError(
        409,
        'Only pending applications can be approved'
      )
    }

    const existingUser = await this.userRepository.findOne({
      where: { emailHash: application.emailHash }
    })

    if (existingUser) {
      throw new ApplicationsHttpError(409, 'Email is already in use')
    }

    const password = randomBytes(9).toString('base64url')
    const hashedPassword = await bcrypt.hash(password, 10)
    const { firstName, lastName } = this.splitName(application.name)

    await this.userRepository.save(
      this.userRepository.create({
        firstName,
        lastName,
        phone: application.phone,
        email: application.email,
        password: hashedPassword,
        status: 'ACTIVE',
        role: UserRole.CLIENT,
        isActive: true
      })
    )

    application.status = ApplicationStatus.APPROVED
    const savedApplication = await this.applicationRepository.save(application)

    return {
      application: this.toApplicationDto(savedApplication),
      password
    }
  }

  async rejectApplication(id: string): Promise<ApplicationDto> {
    const application = await this.getApplicationOrThrow(id)

    if (application.status !== ApplicationStatus.PENDING) {
      throw new ApplicationsHttpError(
        409,
        'Only pending applications can be rejected'
      )
    }

    application.status = ApplicationStatus.REJECTED

    const savedApplication = await this.applicationRepository.save(application)

    return this.toApplicationDto(savedApplication)
  }

  private validateCreatePayload(
    payload: CreateApplicationDto
  ): CreateApplicationDto {
    const email = payload.email.trim().toLowerCase()
    const name = payload.name.trim()
    const restaurantName = payload.restaurantName.trim()
    const address = payload.address.trim()
    const phone = payload.phone.trim()

    if (!email || !name || !restaurantName || !address || !phone) {
      throw new ApplicationsHttpError(400, 'All fields are required')
    }

    if (!isValidEmail(email)) {
      throw new ApplicationsHttpError(400, 'Email format is invalid')
    }

    return {
      email,
      name,
      restaurantName,
      address,
      phone
    }
  }

  private async getApplicationOrThrow(id: string): Promise<Application> {
    if (!id.trim()) {
      throw new ApplicationsHttpError(400, 'Application id is required')
    }

    const application = await this.applicationRepository.findOne({
      where: { id }
    })

    if (!application) {
      throw new ApplicationsHttpError(404, 'Application not found')
    }

    return application
  }

  private splitName(name: string): { firstName: string; lastName: string } {
    const parts = name.trim().split(/\s+/).filter(Boolean)

    const [firstName = '', ...lastNameParts] = parts
    const lastName = lastNameParts.join(' ') || firstName

    return {
      firstName,
      lastName
    }
  }

  private toApplicationDto(application: Application): ApplicationDto {
    return {
      id: application.id,
      email: decryptEmail(application.email),
      name: application.name,
      restaurantName: application.restaurantName,
      address: decryptAddress(application.address),
      phone: decryptPhone(application.phone),
      status: application.status,
      createdAt: application.createdAt
    }
  }
}
