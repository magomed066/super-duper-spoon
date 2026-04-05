import bcrypt from 'bcrypt'
import { Repository } from 'typeorm'

import { hashEmail } from '../../common/utils/encryption.js'
import { AppDataSource } from '../../database/data-source.js'
import { isValidEmail } from '../../helpers/utils.js'
import { RefreshToken } from '../auth/entities/refresh-token.entity.js'
import { User } from './entities/user.entity.js'
import { UserRole } from './enums/user-role.enum.js'

export interface CreateUserDto {
  firstName: string
  lastName: string
  phone: string
  email: string
  password: string
  role?: UserRole
  status?: string
  isActive?: boolean
}

export type UserDto = {
  id: string
  firstName: string
  lastName: string
  phone: string
  email: string
  status: string
  role: UserRole
  isActive: boolean
  createdAt: Date
}

export class UsersHttpError extends Error {
  constructor(public readonly statusCode: number, message: string) {
    super(message)
    this.name = 'UsersHttpError'
  }
}

export class UsersService {
  private readonly userRepository: Repository<User>
  private readonly refreshTokenRepository: Repository<RefreshToken>

  constructor() {
    this.userRepository = AppDataSource.getRepository(User)
    this.refreshTokenRepository = AppDataSource.getRepository(RefreshToken)
  }

  async findByEmail(email: string): Promise<User | null> {
    const normalizedEmail = this.normalizeEmail(email)

    return this.userRepository.findOne({
      where: {
        emailHash: hashEmail(normalizedEmail)
      }
    })
  }

  async findById(id: string): Promise<User | null> {
    const normalizedId = id.trim()

    if (!normalizedId) {
      throw new UsersHttpError(400, 'User id is required')
    }

    return this.userRepository.findOne({
      where: {
        id: normalizedId
      }
    })
  }

  async findAll(): Promise<UserDto[]> {
    const users = await this.userRepository.find({
      order: {
        createdAt: 'DESC'
      }
    })

    return users.map((user) => this.toUserDto(user))
  }

  async create(payload: CreateUserDto): Promise<User> {
    const normalizedPayload = await this.validateAndPrepareCreatePayload(payload)

    const existingUser = await this.findByEmail(normalizedPayload.email)

    if (existingUser) {
      throw new UsersHttpError(409, 'Email is already in use')
    }

    return this.userRepository.save(
      this.userRepository.create(normalizedPayload)
    )
  }

  blockUser(id: string): Promise<UserDto> {
    return this.updateUserActiveStatus(id, false)
  }

  unblockUser(id: string): Promise<UserDto> {
    return this.updateUserActiveStatus(id, true)
  }

  private normalizeEmail(email: string): string {
    const normalizedEmail = email.trim().toLowerCase()

    if (!normalizedEmail) {
      throw new UsersHttpError(400, 'Email is required')
    }

    if (!isValidEmail(normalizedEmail)) {
      throw new UsersHttpError(400, 'Email format is invalid')
    }

    return normalizedEmail
  }

  private async validateAndPrepareCreatePayload(
    payload: CreateUserDto
  ): Promise<Required<CreateUserDto>> {
    const firstName = payload.firstName.trim()
    const lastName = payload.lastName.trim()
    const phone = payload.phone.trim()
    const email = this.normalizeEmail(payload.email)
    const password = payload.password.trim()
    const status = payload.status?.trim() || 'ACTIVE'
    const role = payload.role ?? UserRole.CLIENT
    const isActive = payload.isActive ?? true

    if (!firstName || !lastName || !phone || !password) {
      throw new UsersHttpError(
        400,
        'First name, last name, phone, email, and password are required'
      )
    }

    return {
      firstName,
      lastName,
      phone,
      email,
      password: await bcrypt.hash(password, 10),
      role,
      status,
      isActive
    }
  }

  private async updateUserActiveStatus(
    id: string,
    isActive: boolean
  ): Promise<UserDto> {
    const user = await this.findById(id)

    if (!user) {
      throw new UsersHttpError(404, 'User not found')
    }

    user.isActive = isActive

    const updatedUser = await this.userRepository.save(user)

    if (!isActive) {
      await this.refreshTokenRepository.delete({
        user: {
          id: updatedUser.id
        }
      })
    }

    return this.toUserDto(updatedUser)
  }

  private toUserDto(user: User): UserDto {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      email: user.email,
      status: user.status,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt
    }
  }
}
