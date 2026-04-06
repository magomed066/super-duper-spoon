import { z } from 'zod'

import { AppDataSource } from '../../database/data-source.js'
import { User } from '../users/entities/user.entity.js'
import { UserRole } from '../users/enums/user-role.enum.js'
import { RestaurantAccessService } from './restaurant-access.service.js'
import { RestaurantMembershipRole } from './enums/restaurant-membership-role.enum.js'
import { Restaurant } from './entities/restaurant.entity.js'
import { RestaurantUser } from './entities/restaurant-user.entity.js'

const workScheduleItemSchema = z.object({
  day: z.string().trim().min(1, 'Work schedule day is required'),
  open: z.string().trim().min(1, 'Work schedule open time is required'),
  close: z.string().trim().min(1, 'Work schedule close time is required')
})

const createRestaurantSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(255, 'Name is too long'),
  slug: z
    .string()
    .trim()
    .min(1, 'Slug is required')
    .max(255, 'Slug is too long')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug format is invalid'),
  phone: z
    .string()
    .trim()
    .min(1, 'Phone is required')
    .max(255, 'Phone is too long'),
  phones: z
    .array(z.string().trim().min(1, 'Phone is required').max(255, 'Phone is too long'))
    .default([]),
  address: z
    .string()
    .trim()
    .min(1, 'Address is required')
    .max(1000, 'Address is too long'),
  description: z
    .string()
    .trim()
    .min(1, 'Description is required')
    .max(5000, 'Description is too long'),
  email: z
    .string()
    .trim()
    .email('Email format is invalid')
    .max(255, 'Email is too long')
    .optional(),
  city: z.string().trim().min(1, 'City is required').max(255, 'City is too long').optional(),
  logo: z.string().trim().max(500, 'Logo is too long').optional(),
  preview: z.string().trim().max(500, 'Preview is too long').optional(),
  deliveryTime: z
    .number()
    .int('Delivery time must be an integer')
    .min(0, 'Delivery time cannot be negative')
    .optional(),
  deliveryConditions: z
    .string()
    .trim()
    .max(5000, 'Delivery conditions are too long')
    .optional(),
  cuisine: z
    .array(z.string().trim().min(1, 'Cuisine item is required').max(255, 'Cuisine item is too long'))
    .default([]),
  workSchedule: z.array(workScheduleItemSchema).default([])
})

const assignRestaurantManagerSchema = z.object({
  userId: z.string().trim().min(1, 'User id is required')
})

type CreateRestaurantInput = z.infer<typeof createRestaurantSchema>
type AssignRestaurantManagerInput = z.infer<typeof assignRestaurantManagerSchema>

export interface RestaurantMembershipUserDto {
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

export interface RestaurantMembershipDto {
  id: string
  restaurantId: string
  userId: string
  role: RestaurantMembershipRole
  isActive: boolean
  createdAt: Date
  user: RestaurantMembershipUserDto
}

export class RestaurantsHttpError extends Error {
  constructor(public readonly statusCode: number, message: string) {
    super(message)
    this.name = 'RestaurantsHttpError'
  }
}

interface GetAccessibleRestaurantsOptions {
  includeInactiveMemberships?: boolean
}

export class RestaurantService {
  private readonly restaurantRepository = AppDataSource.getRepository(Restaurant)
  private readonly restaurantUserRepository = AppDataSource.getRepository(RestaurantUser)
  private readonly restaurantAccessService = new RestaurantAccessService(
    this.restaurantRepository,
    this.restaurantUserRepository
  )

  async getAccessibleRestaurantById(
    restaurantId: string,
    currentUser: User | undefined
  ): Promise<Restaurant> {
    if (!currentUser) {
      throw new RestaurantsHttpError(401, 'User is not authenticated')
    }

    const normalizedRestaurantId = restaurantId.trim()

    if (!normalizedRestaurantId) {
      throw new RestaurantsHttpError(400, 'Restaurant id is required')
    }

    const restaurant = await this.restaurantRepository.findOne({
      where: {
        id: normalizedRestaurantId
      }
    })

    if (!restaurant) {
      throw new RestaurantsHttpError(404, 'Restaurant not found')
    }

    const hasAccess = await this.restaurantAccessService.hasRestaurantAccess(
      currentUser.id,
      currentUser.role,
      normalizedRestaurantId
    )

    if (!hasAccess) {
      throw new RestaurantsHttpError(403, 'Access denied')
    }

    return restaurant
  }

  async getAccessibleRestaurants(
    currentUser: User | undefined,
    options: GetAccessibleRestaurantsOptions = {}
  ): Promise<Restaurant[]> {
    if (!currentUser) {
      throw new RestaurantsHttpError(401, 'User is not authenticated')
    }

    const includeInactiveMemberships = options.includeInactiveMemberships ?? false

    if (currentUser.role === UserRole.OWNER) {
      return this.restaurantRepository.find({
        order: {
          createdAt: 'DESC'
        }
      })
    }

    if (!includeInactiveMemberships) {
      const accessibleRestaurantIds =
        await this.restaurantAccessService.getAccessibleRestaurantIds(
          currentUser.id,
          currentUser.role
        )

      if (accessibleRestaurantIds.length === 0) {
        return []
      }

      return this.restaurantRepository.find({
        where: accessibleRestaurantIds.map((id) => ({ id })),
        order: {
          createdAt: 'DESC'
        }
      })
    }

    const membershipRole = this.resolveMembershipRole(currentUser.role)

    return this.restaurantRepository
      .createQueryBuilder('restaurant')
      .innerJoin(
        RestaurantUser,
        'membership',
        this.buildMembershipJoinCondition(includeInactiveMemberships),
        {
          userId: currentUser.id,
          membershipRole
        }
      )
      .orderBy('restaurant.createdAt', 'DESC')
      .getMany()
  }

  async createRestaurant(
    payload: unknown,
    currentUser: User | undefined
  ): Promise<Restaurant> {
    if (!currentUser) {
      throw new RestaurantsHttpError(401, 'User is not authenticated')
    }

    const validationResult = createRestaurantSchema.safeParse(payload)

    if (!validationResult.success) {
      throw new RestaurantsHttpError(
        400,
        validationResult.error.issues[0]?.message ?? 'Invalid restaurant payload'
      )
    }

    const normalizedPayload = validationResult.data
    const email = normalizedPayload.email ?? this.buildRestaurantEmail(normalizedPayload.slug)

    return AppDataSource.transaction(async (manager) => {
      const restaurantRepository = manager.getRepository(Restaurant)
      const restaurantUserRepository = manager.getRepository(RestaurantUser)

      const existingRestaurant = await restaurantRepository.findOne({
        where: [{ slug: normalizedPayload.slug }, { email }]
      })

      if (existingRestaurant) {
        throw new RestaurantsHttpError(409, 'Restaurant slug is already in use')
      }

      const restaurant = restaurantRepository.create(
        this.toRestaurantEntity(normalizedPayload, email)
      )

      const savedRestaurant = await restaurantRepository.save(restaurant)

      const membership = restaurantUserRepository.create({
        restaurantId: savedRestaurant.id,
        userId: currentUser.id,
        role: RestaurantMembershipRole.OWNER,
        isActive: true
      })

      await restaurantUserRepository.save(membership)

      return savedRestaurant
    })
  }

  async assignManager(
    restaurantId: string,
    payload: unknown,
    currentUser: User | undefined
  ): Promise<RestaurantMembershipDto> {
    if (!currentUser) {
      throw new RestaurantsHttpError(401, 'User is not authenticated')
    }

    const normalizedRestaurantId = await this.assertManagerAssignmentAccess(
      restaurantId,
      currentUser
    )
    const normalizedPayload = this.parseAssignRestaurantManagerPayload(payload)

    return AppDataSource.transaction(async (manager) => {
      const userRepository = manager.getRepository(User)
      const restaurantUserRepository = manager.getRepository(RestaurantUser)

      const user = await userRepository.findOne({
        where: {
          id: normalizedPayload.userId
        }
      })

      if (!user) {
        throw new RestaurantsHttpError(404, 'User not found')
      }

      if (!user.isActive) {
        throw new RestaurantsHttpError(409, 'Only active users can be assigned')
      }

      const existingMembership = await restaurantUserRepository.findOne({
        where: {
          restaurantId: normalizedRestaurantId,
          userId: normalizedPayload.userId
        },
        relations: {
          user: true
        }
      })

      if (existingMembership) {
        throw new RestaurantsHttpError(409, 'User is already a restaurant member')
      }

      const membership = restaurantUserRepository.create({
        restaurantId: normalizedRestaurantId,
        userId: normalizedPayload.userId,
        role: RestaurantMembershipRole.MANAGER,
        isActive: true
      })

      const savedMembership = await restaurantUserRepository.save(membership)

      return this.toRestaurantMembershipDto({
        ...savedMembership,
        user
      })
    })
  }

  async removeManager(
    restaurantId: string,
    userId: string,
    currentUser: User | undefined
  ): Promise<void> {
    if (!currentUser) {
      throw new RestaurantsHttpError(401, 'User is not authenticated')
    }

    const normalizedRestaurantId = await this.assertManagerAssignmentAccess(
      restaurantId,
      currentUser
    )
    const normalizedUserId = this.normalizeId(userId, 'User id is required')

    const membership = await this.restaurantUserRepository.findOne({
      where: {
        restaurantId: normalizedRestaurantId,
        userId: normalizedUserId
      }
    })

    if (!membership) {
      throw new RestaurantsHttpError(404, 'Restaurant membership not found')
    }

    if (membership.role !== RestaurantMembershipRole.MANAGER) {
      throw new RestaurantsHttpError(409, 'Only manager memberships can be removed')
    }

    await this.restaurantUserRepository.remove(membership)
  }

  async getRestaurantUsers(
    restaurantId: string,
    currentUser: User | undefined
  ): Promise<RestaurantMembershipDto[]> {
    if (!currentUser) {
      throw new RestaurantsHttpError(401, 'User is not authenticated')
    }

    const normalizedRestaurantId = this.normalizeId(
      restaurantId,
      'Restaurant id is required'
    )

    await this.getAccessibleRestaurantById(normalizedRestaurantId, currentUser)

    const memberships = await this.restaurantUserRepository.find({
      where: {
        restaurantId: normalizedRestaurantId
      },
      relations: {
        user: true
      },
      order: {
        createdAt: 'DESC'
      }
    })

    return memberships.map((membership) => this.toRestaurantMembershipDto(membership))
  }

  private buildRestaurantEmail(slug: string): string {
    return `${slug}@restaurant.local`
  }

  private parseAssignRestaurantManagerPayload(
    payload: unknown
  ): AssignRestaurantManagerInput {
    const validationResult = assignRestaurantManagerSchema.safeParse(payload)

    if (!validationResult.success) {
      throw new RestaurantsHttpError(
        400,
        validationResult.error.issues[0]?.message ??
          'Invalid manager assignment payload'
      )
    }

    return validationResult.data
  }

  private async assertManagerAssignmentAccess(
    restaurantId: string,
    currentUser: User
  ): Promise<string> {
    const normalizedRestaurantId = this.normalizeId(
      restaurantId,
      'Restaurant id is required'
    )

    const restaurant = await this.restaurantRepository.findOne({
      where: {
        id: normalizedRestaurantId
      }
    })

    if (!restaurant) {
      throw new RestaurantsHttpError(404, 'Restaurant not found')
    }

    if (currentUser.role === UserRole.OWNER) {
      return normalizedRestaurantId
    }

    const isRestaurantOwner = await this.restaurantAccessService.isRestaurantOwner(
      currentUser.id,
      normalizedRestaurantId
    )

    if (!isRestaurantOwner) {
      throw new RestaurantsHttpError(403, 'Access denied')
    }

    return normalizedRestaurantId
  }

  private normalizeId(value: string, errorMessage: string): string {
    const normalizedValue = value.trim()

    if (!normalizedValue) {
      throw new RestaurantsHttpError(400, errorMessage)
    }

    return normalizedValue
  }

  private resolveMembershipRole(userRole: UserRole): RestaurantMembershipRole {
    if (userRole === UserRole.CLIENT) {
      return RestaurantMembershipRole.OWNER
    }

    if (userRole === UserRole.MANAGER) {
      return RestaurantMembershipRole.MANAGER
    }

    throw new RestaurantsHttpError(403, 'Access denied')
  }

  private buildMembershipJoinCondition(includeInactiveMemberships: boolean): string {
    const conditions = [
      'membership.restaurantId = restaurant.id',
      'membership.userId = :userId',
      'membership.role = :membershipRole'
    ]

    if (!includeInactiveMemberships) {
      conditions.push('membership.isActive = true')
    }

    return conditions.join(' AND ')
  }

  private toRestaurantMembershipDto(
    membership: RestaurantUser & { user: User }
  ): RestaurantMembershipDto {
    return {
      id: membership.id,
      restaurantId: membership.restaurantId,
      userId: membership.userId,
      role: membership.role,
      isActive: membership.isActive,
      createdAt: membership.createdAt,
      user: {
        id: membership.user.id,
        firstName: membership.user.firstName,
        lastName: membership.user.lastName,
        phone: membership.user.phone,
        email: membership.user.email,
        status: membership.user.status,
        role: membership.user.role,
        isActive: membership.user.isActive,
        createdAt: membership.user.createdAt
      }
    }
  }

  private toRestaurantEntity(
    payload: CreateRestaurantInput,
    email: string
  ): Partial<Restaurant> {
    return {
      name: payload.name,
      slug: payload.slug,
      email,
      phone: payload.phone,
      phones: payload.phones.length > 0 ? payload.phones : [payload.phone],
      address: payload.address,
      description: payload.description,
      city: payload.city ?? 'TBD',
      logo: payload.logo ?? '',
      preview: payload.preview ?? '',
      deliveryTime: payload.deliveryTime ?? 0,
      deliveryConditions: payload.deliveryConditions ?? '',
      cuisine: payload.cuisine,
      workSchedule: payload.workSchedule,
      isActive: true
    }
  }
}
