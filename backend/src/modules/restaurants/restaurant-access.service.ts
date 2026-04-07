import { Repository } from 'typeorm'

import {
  hasRestaurantRole,
  isSystemOwner
} from '../../common/rbac/index.js'
import { AppDataSource } from '../../database/data-source.js'
import { normalizeRestaurantScopeId } from '../../common/restaurant-scope/index.js'
import { UserRole } from '../users/enums/user-role.enum.js'
import { RestaurantRole } from './enums/restaurant-role.enum.js'
import { Restaurant } from './entities/restaurant.entity.js'
import { RestaurantUser } from './entities/restaurant-user.entity.js'

type RestaurantMembershipRecord = Pick<
  RestaurantUser,
  'id' | 'restaurantId' | 'userId' | 'role' | 'isActive' | 'createdAt'
>

export class RestaurantAccessService {
  private readonly restaurantRepository: Repository<Restaurant>
  private readonly restaurantUserRepository: Repository<RestaurantUser>

  constructor(
    restaurantRepository: Repository<Restaurant> = AppDataSource.getRepository(Restaurant),
    restaurantUserRepository: Repository<RestaurantUser> = AppDataSource.getRepository(
      RestaurantUser
    )
  ) {
    this.restaurantRepository = restaurantRepository
    this.restaurantUserRepository = restaurantUserRepository
  }

  async hasRestaurantAccess(
    userId: string,
    systemRole: UserRole,
    restaurantId: string
  ): Promise<boolean> {
    const normalizedRestaurantId = this.normalizeId(restaurantId)

    if (!normalizedRestaurantId) {
      return false
    }

    if (isSystemOwner(systemRole)) {
      return this.restaurantRepository.exists({
        where: {
          id: normalizedRestaurantId
        }
      })
    }

    const membership = await this.getRestaurantMembership(
      userId,
      normalizedRestaurantId
    )

    return membership !== null
  }

  async canUpdateRestaurant(
    userId: string,
    systemRole: UserRole,
    restaurantId: string
  ): Promise<boolean> {
    const normalizedRestaurantId = this.normalizeId(restaurantId)
    const normalizedUserId = this.normalizeId(userId)

    if (!normalizedRestaurantId || !normalizedUserId) {
      return false
    }

    if (systemRole !== UserRole.CLIENT) {
      return false
    }

    return this.isRestaurantOwner(normalizedUserId, normalizedRestaurantId)
  }

  async canDeleteRestaurant(
    userId: string,
    systemRole: UserRole,
    restaurantId: string
  ): Promise<boolean> {
    const normalizedRestaurantId = this.normalizeId(restaurantId)
    const normalizedUserId = this.normalizeId(userId)

    if (!normalizedRestaurantId || !normalizedUserId) {
      return false
    }

    if (isSystemOwner(systemRole)) {
      return this.restaurantRepository.exists({
        where: {
          id: normalizedRestaurantId
        }
      })
    }

    return this.isRestaurantOwner(normalizedUserId, normalizedRestaurantId)
  }

  async isRestaurantOwner(userId: string, restaurantId: string): Promise<boolean> {
    return this.hasMembership(userId, restaurantId, RestaurantRole.OWNER)
  }

  async isRestaurantManager(userId: string, restaurantId: string): Promise<boolean> {
    return this.hasMembership(userId, restaurantId, RestaurantRole.MANAGER)
  }

  async getRestaurantMembership(
    userId: string,
    restaurantId: string
  ): Promise<RestaurantMembershipRecord | null> {
    const normalizedUserId = this.normalizeId(userId)
    const normalizedRestaurantId = this.normalizeId(restaurantId)

    if (!normalizedUserId || !normalizedRestaurantId) {
      return null
    }

    return this.restaurantUserRepository.findOne({
      select: {
        id: true,
        restaurantId: true,
        userId: true,
        role: true,
        isActive: true,
        createdAt: true
      },
      where: {
        restaurantId: normalizedRestaurantId,
        userId: normalizedUserId,
        isActive: true
      }
    })
  }

  async getAccessibleRestaurantIds(
    userId: string,
    systemRole: UserRole
  ): Promise<string[]> {
    const normalizedUserId = this.normalizeId(userId)

    if (!normalizedUserId) {
      return []
    }

    if (isSystemOwner(systemRole)) {
      const restaurants = await this.restaurantRepository.find({
        select: {
          id: true
        }
      })

      return restaurants.map((restaurant) => restaurant.id)
    }

    const memberships = await this.restaurantUserRepository.find({
      select: {
        restaurantId: true
      },
      where: {
        userId: normalizedUserId,
        isActive: true
      }
    })

    return memberships.map((membership) => membership.restaurantId)
  }

  private async hasMembership(
    userId: string,
    restaurantId: string,
    membershipRole: RestaurantRole
  ): Promise<boolean> {
    const membership = await this.getRestaurantMembership(userId, restaurantId)

    return membership !== null && hasRestaurantRole(membership.role, [membershipRole])
  }

  private normalizeId(value: string): string {
    return normalizeRestaurantScopeId(value)
  }
}
