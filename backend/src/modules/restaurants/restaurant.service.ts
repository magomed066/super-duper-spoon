import type { Repository } from 'typeorm'

import {
  canCreateRestaurant,
  isSystemOwner
} from '../../common/rbac/index.js'
import { AppDataSource } from '../../database/data-source.js'
import type { AuthenticatedRequestUser } from '../auth/types/auth.types.js'
import { User } from '../users/entities/user.entity.js'
import { UserRole } from '../users/enums/user-role.enum.js'
import { RestaurantAccessService } from './restaurant-access.service.js'
import { RestaurantStatusTransitionService } from './restaurant-status-transition.service.js'
import { RestaurantsHttpError } from './restaurants.errors.js'
import { RestaurantTenantService } from './restaurant-tenant.service.js'
import { assignRestaurantManagerSchema } from './dto/assign-restaurant-manager.dto.js'
import { createRestaurantSchema } from './dto/create-restaurant.dto.js'
import { updateRestaurantSchema } from './dto/update-restaurant.dto.js'
import { RestaurantRole } from './enums/restaurant-role.enum.js'
import { RestaurantStatus } from './enums/restaurant-status.enum.js'
import { Restaurant } from './entities/restaurant.entity.js'
import { RestaurantUser } from './entities/restaurant-user.entity.js'
import {
  buildRestaurantEmail,
  toRestaurantEntity,
  toRestaurantMembershipDto,
  toUpdatedRestaurantEntity
} from './helpers/restaurant.mapper.js'
import {
  applyPublicVisibilityFilter,
  applyRestaurantFilters,
  buildMembershipJoinCondition,
  isRestaurantPubliclyVisible
} from './helpers/restaurant-query.helpers.js'
import {
  buildSlugPattern,
  generateSlug
} from './helpers/restaurant-slug.helpers.js'
import type {
  AssignManagerResultDto,
  AssignRestaurantManagerInput,
  CreateRestaurantResultDto,
  GetAccessibleRestaurantsOptions,
  GetPublicRestaurantsOptions,
  NormalizedCreateRestaurantInput,
  PaginatedRestaurantsDto,
  RestaurantMembershipDto,
  UpdateRestaurantInput
} from './types/restaurant.service.types.js'

const OWNER_ARCHIVABLE_RESTAURANT_STATUSES = new Set<RestaurantStatus>([
  RestaurantStatus.ACTIVE
])

const SYSTEM_OWNER_ARCHIVABLE_RESTAURANT_STATUSES = new Set<RestaurantStatus>([
  RestaurantStatus.ACTIVE,
  RestaurantStatus.BLOCKED
])

const OWNER_DELETABLE_RESTAURANT_STATUSES = new Set<RestaurantStatus>([
  RestaurantStatus.DRAFT,
  RestaurantStatus.CHANGES_REQUIRED,
  RestaurantStatus.REJECTED,
  RestaurantStatus.ARCHIVED
])

const INACTIVE_RESTAURANT_MESSAGE = 'Restaurant is not active'

export class RestaurantService {
  private readonly restaurantRepository = AppDataSource.getRepository(Restaurant)
  private readonly restaurantUserRepository = AppDataSource.getRepository(RestaurantUser)
  private readonly restaurantAccessService = new RestaurantAccessService(
    this.restaurantRepository,
    this.restaurantUserRepository
  )
  private readonly restaurantStatusTransitionService =
    new RestaurantStatusTransitionService()
  private readonly restaurantTenantService = new RestaurantTenantService(
    this.restaurantRepository,
    this.restaurantUserRepository
  )

  async getAccessibleRestaurantById(
    restaurantId: string,
    currentUser: AuthenticatedRequestUser | undefined
  ): Promise<Restaurant> {
    if (!currentUser) {
      throw new RestaurantsHttpError(401, 'User is not authenticated')
    }

    const restaurant = await this.getRestaurantByIdOrThrow(restaurantId)

    if (isSystemOwner(currentUser.role)) {
      return restaurant
    }

    const membership = await this.restaurantAccessService.getRestaurantMembership(
      currentUser.id,
      restaurant.id
    )

    if (!membership) {
      throw new RestaurantsHttpError(403, 'Access denied')
    }

    if (membership.role === RestaurantRole.OWNER || isRestaurantPubliclyVisible(restaurant)) {
      return restaurant
    }

    throw new RestaurantsHttpError(409, INACTIVE_RESTAURANT_MESSAGE)
  }

  async getPublicRestaurantById(restaurantId: string): Promise<Restaurant> {
    const restaurant = await this.getRestaurantByIdOrThrow(restaurantId)

    if (!isRestaurantPubliclyVisible(restaurant)) {
      throw new RestaurantsHttpError(409, INACTIVE_RESTAURANT_MESSAGE)
    }

    return restaurant
  }

  async getRestaurantForUpdateById(
    restaurantId: string,
    currentUser: AuthenticatedRequestUser | undefined
  ): Promise<Restaurant> {
    if (!currentUser) {
      throw new RestaurantsHttpError(401, 'User is not authenticated')
    }

    return this.getRestaurantForMutation(restaurantId, currentUser, 'update')
  }

  async getAccessibleRestaurants(
    currentUser: AuthenticatedRequestUser | undefined,
    options: GetAccessibleRestaurantsOptions = {}
  ): Promise<PaginatedRestaurantsDto> {
    if (!currentUser) {
      throw new RestaurantsHttpError(401, 'User is not authenticated')
    }

    const includeInactiveMemberships = options.includeInactiveMemberships ?? false
    const page = options.page ?? 1
    const limit = options.limit ?? 10
    const offset = (page - 1) * limit

    const query = this.restaurantRepository
      .createQueryBuilder('restaurant')
      .orderBy('restaurant.createdAt', 'DESC')
      .distinct(true)

    if (!isSystemOwner(currentUser.role)) {
      query.innerJoin(
        RestaurantUser,
        'membership',
        buildMembershipJoinCondition(includeInactiveMemberships),
        {
          userId: currentUser.id
        }
      )
    } else {
      query.andWhere('restaurant.status != :excludedDraftStatus', {
        excludedDraftStatus: RestaurantStatus.DRAFT
      })
    }

    applyRestaurantFilters(query, options)

    const [items, total] = await query.skip(offset).take(limit).getManyAndCount()
    const totalPages = total === 0 ? 0 : Math.ceil(total / limit)

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    }
  }

  async getPublicRestaurants(
    options: GetPublicRestaurantsOptions = {}
  ): Promise<PaginatedRestaurantsDto> {
    const page = options.page ?? 1
    const limit = options.limit ?? 10
    const offset = (page - 1) * limit

    const query = this.restaurantRepository
      .createQueryBuilder('restaurant')
      .orderBy('restaurant.createdAt', 'DESC')

    applyPublicVisibilityFilter(query)
    applyRestaurantFilters(query, options)

    const [items, total] = await query.skip(offset).take(limit).getManyAndCount()
    const totalPages = total === 0 ? 0 : Math.ceil(total / limit)

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    }
  }

  async createRestaurant(
    payload: unknown,
    currentUser: AuthenticatedRequestUser | undefined
  ): Promise<CreateRestaurantResultDto> {
    if (!currentUser) {
      throw new RestaurantsHttpError(401, 'User is not authenticated')
    }

    this.assertCanCreateRestaurant(currentUser)

    const normalizedPayload = this.parseCreateRestaurantPayload(payload)

    return AppDataSource.transaction(async (manager) => {
      const restaurantRepository = manager.getRepository(Restaurant)
      const restaurantUserRepository = manager.getRepository(RestaurantUser)
      const userRepository = manager.getRepository(User)
      const slug = await this.resolveCreateRestaurantSlug(
        restaurantRepository,
        normalizedPayload
      )
      const email = normalizedPayload.email ?? buildRestaurantEmail(slug)

      const existingRestaurantByEmail = await restaurantRepository.findOneBy({
        email
      })

      if (existingRestaurantByEmail) {
        throw new RestaurantsHttpError(409, 'Restaurant email is already in use')
      }

      const restaurant = restaurantRepository.create(
        toRestaurantEntity(
          {
            ...normalizedPayload,
            slug
          },
          email
        )
      )

      const savedRestaurant = await restaurantRepository.save(restaurant)

      const membership = await this.createOwnerMembership(
        restaurantUserRepository,
        savedRestaurant.id,
        currentUser.id
      )
      const user = await userRepository.findOneBy({ id: currentUser.id })

      if (!user) {
        throw new RestaurantsHttpError(404, 'User not found')
      }

      return {
        restaurant: savedRestaurant,
        membership: toRestaurantMembershipDto({
          ...membership,
          user
        })
      }
    })
  }

  async updateRestaurant(
    restaurantId: string,
    payload: unknown,
    currentUser: AuthenticatedRequestUser | undefined
  ): Promise<Restaurant> {
    if (!currentUser) {
      throw new RestaurantsHttpError(401, 'User is not authenticated')
    }

    const restaurant = await this.getRestaurantForMutation(
      restaurantId,
      currentUser,
      'update'
    )
    const previousStatus = restaurant.status
    const normalizedPayload = this.parseUpdateRestaurantPayload(payload)

    if (normalizedPayload.slug || normalizedPayload.email) {
      if (normalizedPayload.slug) {
        const duplicateRestaurantBySlug = await this.restaurantRepository.findOne({
          where: {
            slug: normalizedPayload.slug
          }
        })

        if (duplicateRestaurantBySlug && duplicateRestaurantBySlug.id !== restaurant.id) {
          throw new RestaurantsHttpError(409, 'Restaurant slug is already in use')
        }
      }

      if (normalizedPayload.email) {
        const duplicateRestaurantByEmail = await this.restaurantRepository.findOne({
          where: {
            email: normalizedPayload.email
          }
        })

        if (duplicateRestaurantByEmail && duplicateRestaurantByEmail.id !== restaurant.id) {
          throw new RestaurantsHttpError(409, 'Restaurant email is already in use')
        }
      }
    }

    Object.assign(restaurant, toUpdatedRestaurantEntity(restaurant, normalizedPayload))
    this.applyPostUpdateStatus(restaurant, previousStatus, currentUser)

    return this.restaurantRepository.save(restaurant)
  }

  async deleteRestaurant(
    restaurantId: string,
    currentUser: AuthenticatedRequestUser | undefined
  ): Promise<void> {
    if (!currentUser) {
      throw new RestaurantsHttpError(401, 'User is not authenticated')
    }

    const restaurant = await this.getRestaurantForMutation(
      restaurantId,
      currentUser,
      'delete'
    )

    if (
      currentUser.role === UserRole.CLIENT &&
      !OWNER_DELETABLE_RESTAURANT_STATUSES.has(restaurant.status)
    ) {
      throw new RestaurantsHttpError(
        409,
        `Restaurant owners cannot delete restaurants from status ${restaurant.status}`
      )
    }

    await AppDataSource.transaction(async (manager) => {
      const restaurantRepository = manager.getRepository(Restaurant)
      const restaurantUserRepository = manager.getRepository(RestaurantUser)

      await restaurantUserRepository.delete({
        restaurantId: restaurant.id
      })

      await restaurantRepository.remove(restaurant)
    })
  }

  async submitForApproval(
    restaurantId: string,
    currentUser: AuthenticatedRequestUser | undefined
  ): Promise<Restaurant> {
    if (!currentUser) {
      throw new RestaurantsHttpError(401, 'User is not authenticated')
    }

    const restaurant = await this.getRestaurantForSubmitForApproval(
      restaurantId,
      currentUser
    )

    return this.performModerationTransition(
      restaurant,
      RestaurantStatus.PENDING_APPROVAL,
      'submit for approval'
    )
  }

  async approve(
    restaurantId: string,
    currentUser: AuthenticatedRequestUser | undefined
  ): Promise<Restaurant> {
    const restaurant = await this.getRestaurantForSystemModeration(
      restaurantId,
      currentUser,
      'approve restaurants'
    )

    return this.performModerationTransition(
      restaurant,
      RestaurantStatus.ACTIVE,
      'approve'
    )
  }

  async requestChanges(
    restaurantId: string,
    currentUser: AuthenticatedRequestUser | undefined
  ): Promise<Restaurant> {
    const restaurant = await this.getRestaurantForSystemModeration(
      restaurantId,
      currentUser,
      'request changes'
    )

    return this.performModerationTransition(
      restaurant,
      RestaurantStatus.CHANGES_REQUIRED,
      'request changes'
    )
  }

  async reject(
    restaurantId: string,
    currentUser: AuthenticatedRequestUser | undefined
  ): Promise<Restaurant> {
    const restaurant = await this.getRestaurantForSystemModeration(
      restaurantId,
      currentUser,
      'reject restaurants'
    )

    return this.performModerationTransition(
      restaurant,
      RestaurantStatus.REJECTED,
      'reject'
    )
  }

  async block(
    restaurantId: string,
    currentUser: AuthenticatedRequestUser | undefined
  ): Promise<Restaurant> {
    const restaurant = await this.getRestaurantForSystemModeration(
      restaurantId,
      currentUser,
      'block restaurants'
    )

    return this.performModerationTransition(
      restaurant,
      RestaurantStatus.BLOCKED,
      'block'
    )
  }

  async unblock(
    restaurantId: string,
    currentUser: AuthenticatedRequestUser | undefined
  ): Promise<Restaurant> {
    const restaurant = await this.getRestaurantForSystemModeration(
      restaurantId,
      currentUser,
      'unblock restaurants'
    )

    return this.performModerationTransition(
      restaurant,
      RestaurantStatus.ACTIVE,
      'unblock'
    )
  }

  async archive(
    restaurantId: string,
    currentUser: AuthenticatedRequestUser | undefined
  ): Promise<Restaurant> {
    if (!currentUser) {
      throw new RestaurantsHttpError(401, 'User is not authenticated')
    }

    const restaurant = await this.getRestaurantForMutation(
      restaurantId,
      currentUser,
      'archive'
    )

    if (restaurant.status === RestaurantStatus.ARCHIVED) {
      throw new RestaurantsHttpError(409, 'Restaurant is already archived')
    }

    if (isSystemOwner(currentUser.role)) {
      if (!SYSTEM_OWNER_ARCHIVABLE_RESTAURANT_STATUSES.has(restaurant.status)) {
        throw new RestaurantsHttpError(
          409,
          `System owners cannot archive restaurants from status ${restaurant.status}`
        )
      }
    } else if (!OWNER_ARCHIVABLE_RESTAURANT_STATUSES.has(restaurant.status)) {
      throw new RestaurantsHttpError(
        409,
        `Restaurant owners cannot archive restaurants from status ${restaurant.status}`
      )
    }

    this.applyStatusTransition(restaurant, RestaurantStatus.ARCHIVED, 'archive')

    return this.restaurantRepository.save(restaurant)
  }

  async assignManager(
    restaurantId: string,
    payload: unknown,
    currentUser: AuthenticatedRequestUser | undefined
  ): Promise<AssignManagerResultDto> {
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

      this.assertCanAssignRestaurantManager(user)

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
        if (existingMembership.role === RestaurantRole.OWNER) {
          throw new RestaurantsHttpError(
            409,
            'Restaurant owners already have higher restaurant access'
          )
        }

        existingMembership.role = RestaurantRole.MANAGER
        existingMembership.isActive = true

        const savedMembership = await restaurantUserRepository.save(existingMembership)

        return {
          membership: toRestaurantMembershipDto({
            ...savedMembership,
            user
          }),
          created: false
        }
      }

      const membership = restaurantUserRepository.create(
        this.restaurantTenantService.createScopedPayload(
          {
            userId: normalizedPayload.userId,
            role: RestaurantRole.MANAGER,
            isActive: true
          },
          normalizedRestaurantId
        )
      )

      const savedMembership = await restaurantUserRepository.save(membership)

      return {
        membership: toRestaurantMembershipDto({
          ...savedMembership,
          user
        }),
        created: true
      }
    })
  }

  async removeManager(
    restaurantId: string,
    userId: string,
    currentUser: AuthenticatedRequestUser | undefined
  ): Promise<void> {
    if (!currentUser) {
      throw new RestaurantsHttpError(401, 'User is not authenticated')
    }

    const normalizedRestaurantId = await this.assertManagerAssignmentAccess(
      restaurantId,
      currentUser
    )
    const normalizedUserId = this.normalizeId(userId, 'User id is required')

    const membership = await this.restaurantTenantService
      .buildScopedQuery(
        this.restaurantUserRepository,
        'membership',
        normalizedRestaurantId
      )
      .andWhere('membership.userId = :userId', {
        userId: normalizedUserId
      })
      .getOne()

    if (!membership) {
      throw new RestaurantsHttpError(404, 'Restaurant membership not found')
    }

    if (membership.role !== RestaurantRole.MANAGER) {
      throw new RestaurantsHttpError(409, 'Only manager memberships can be removed')
    }

    await this.restaurantUserRepository.remove(membership)
  }

  async getRestaurantUsers(
    restaurantId: string,
    currentUser: AuthenticatedRequestUser | undefined
  ): Promise<RestaurantMembershipDto[]> {
    if (!currentUser) {
      throw new RestaurantsHttpError(401, 'User is not authenticated')
    }

    const normalizedRestaurantId = this.normalizeId(
      restaurantId,
      'Restaurant id is required'
    )

    await this.getAccessibleRestaurantById(normalizedRestaurantId, currentUser)

    const memberships = await this.restaurantTenantService
      .buildScopedQuery(
        this.restaurantUserRepository,
        'membership',
        normalizedRestaurantId
      )
      .leftJoinAndSelect('membership.user', 'user')
      .orderBy('membership.createdAt', 'DESC')
      .getMany()

    return memberships.map((membership) => toRestaurantMembershipDto(membership))
  }

  private async getRestaurantByIdOrThrow(restaurantId: string): Promise<Restaurant> {
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

    return restaurant
  }

  private applyStatusTransition(
    restaurant: Restaurant,
    nextStatus: RestaurantStatus,
    actionLabel: string
  ): void {
    this.restaurantStatusTransitionService.assertCanTransition(
      restaurant.status,
      nextStatus,
      actionLabel
    )

    restaurant.status = nextStatus
    restaurant.isActive =
      this.restaurantStatusTransitionService.getDefaultIsActive(nextStatus)
  }

  private applyPostUpdateStatus(
    restaurant: Restaurant,
    previousStatus: RestaurantStatus,
    currentUser: AuthenticatedRequestUser
  ): void {
    if (isSystemOwner(currentUser.role)) {
      return
    }

    if (previousStatus === RestaurantStatus.ACTIVE) {
      restaurant.status = RestaurantStatus.PENDING_APPROVAL
      restaurant.isActive = false
      return
    }

    if (
      previousStatus === RestaurantStatus.DRAFT ||
      previousStatus === RestaurantStatus.CHANGES_REQUIRED
    ) {
      restaurant.status = previousStatus
      restaurant.isActive = false
      return
    }

    restaurant.status = RestaurantStatus.DRAFT
    restaurant.isActive = false
  }

  private async performModerationTransition(
    restaurant: Restaurant,
    nextStatus: RestaurantStatus,
    actionLabel: string
  ): Promise<Restaurant> {
    this.applyStatusTransition(restaurant, nextStatus, actionLabel)

    return this.restaurantRepository.save(restaurant)
  }

  private parseCreateRestaurantPayload(
    payload: unknown
  ): NormalizedCreateRestaurantInput {
    const validationResult = createRestaurantSchema.safeParse(payload)

    if (!validationResult.success) {
      throw new RestaurantsHttpError(
        400,
        validationResult.error.issues[0]?.message ?? 'Invalid restaurant payload'
      )
    }

    return validationResult.data
  }

  private async resolveCreateRestaurantSlug(
    restaurantRepository: Repository<Restaurant>,
    payload: NormalizedCreateRestaurantInput
  ): Promise<string> {
    if (payload.slug) {
      const existingRestaurant = await restaurantRepository.findOneBy({
        slug: payload.slug
      })

      if (existingRestaurant) {
        throw new RestaurantsHttpError(409, 'Restaurant slug is already in use')
      }

      return payload.slug
    }

    const baseSlug = generateSlug(payload.name)

    if (!baseSlug) {
      throw new RestaurantsHttpError(
        400,
        'Slug could not be generated from name, provide slug manually'
      )
    }

    const existingSlugs = await restaurantRepository
      .createQueryBuilder('restaurant')
      .select('restaurant.slug', 'slug')
      .where('restaurant.slug = :baseSlug', { baseSlug })
      .orWhere('restaurant.slug LIKE :slugPattern', {
        slugPattern: buildSlugPattern(baseSlug)
      })
      .getRawMany<{ slug: string }>()

    if (existingSlugs.length === 0) {
      return baseSlug
    }

    const usedSlugs = new Set(existingSlugs.map(({ slug }) => slug))

    if (!usedSlugs.has(baseSlug)) {
      return baseSlug
    }

    let suffix = 2

    while (usedSlugs.has(`${baseSlug}-${suffix}`)) {
      suffix += 1
    }

    return `${baseSlug}-${suffix}`
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

  private assertCanCreateRestaurant(currentUser: AuthenticatedRequestUser): void {
    if (!canCreateRestaurant(currentUser.role)) {
      throw new RestaurantsHttpError(403, 'Access denied')
    }
  }

  private async createOwnerMembership(
    restaurantUserRepository: Repository<RestaurantUser>,
    restaurantId: string,
    userId: string
  ): Promise<RestaurantUser> {
    // Creating a restaurant grants a restaurant-scoped OWNER membership.
    // The user's platform role remains a UserRole and is evaluated separately.
    const membership = restaurantUserRepository.create({
      restaurantId,
      userId,
      role: RestaurantRole.OWNER,
      isActive: true
    })

    return restaurantUserRepository.save(membership)
  }

  private parseUpdateRestaurantPayload(payload: unknown): UpdateRestaurantInput {
    const validationResult = updateRestaurantSchema.safeParse(payload)

    if (!validationResult.success) {
      throw new RestaurantsHttpError(
        400,
        validationResult.error.issues[0]?.message ?? 'Invalid restaurant payload'
      )
    }

    return validationResult.data
  }

  private async getRestaurantForMutation(
    restaurantId: string,
    currentUser: AuthenticatedRequestUser,
    action: 'update' | 'delete' | 'archive'
  ): Promise<Restaurant> {
    return this.restaurantTenantService.getRestaurantForMutation(
      restaurantId,
      currentUser,
      action
    )
  }

  private async assertManagerAssignmentAccess(
    restaurantId: string,
    currentUser: AuthenticatedRequestUser
  ): Promise<string> {
    return this.restaurantTenantService.assertRestaurantOwnerAccess(
      restaurantId,
      currentUser
    )
  }

  private normalizeId(value: string, errorMessage: string): string {
    const normalizedValue = value.trim()

    if (!normalizedValue) {
      throw new RestaurantsHttpError(400, errorMessage)
    }

    return normalizedValue
  }

  private async getRestaurantForSubmitForApproval(
    restaurantId: string,
    currentUser: AuthenticatedRequestUser
  ): Promise<Restaurant> {
    if (isSystemOwner(currentUser.role)) {
      return this.getRestaurantByIdOrThrow(restaurantId)
    }

    const normalizedRestaurantId =
      await this.restaurantTenantService.assertRestaurantOwnerAccess(
        restaurantId,
        currentUser
      )

    return this.getRestaurantByIdOrThrow(normalizedRestaurantId)
  }

  private async getRestaurantForSystemModeration(
    restaurantId: string,
    currentUser: AuthenticatedRequestUser | undefined,
    actionLabel: string
  ): Promise<Restaurant> {
    this.assertSystemOwner(currentUser, actionLabel)

    return this.getRestaurantByIdOrThrow(restaurantId)
  }

  private assertSystemOwner(
    currentUser: AuthenticatedRequestUser | undefined,
    actionLabel: string
  ): asserts currentUser is AuthenticatedRequestUser {
    if (!currentUser) {
      throw new RestaurantsHttpError(401, 'User is not authenticated')
    }

    if (currentUser.role !== UserRole.SYSTEM_OWNER) {
      throw new RestaurantsHttpError(403, `Only system owners can ${actionLabel}`)
    }
  }

  private assertCanAssignRestaurantManager(user: User): void {
    if (user.role === UserRole.SYSTEM_OWNER) {
      throw new RestaurantsHttpError(
        409,
        'System owners cannot be assigned restaurant manager memberships'
      )
    }
  }
}
