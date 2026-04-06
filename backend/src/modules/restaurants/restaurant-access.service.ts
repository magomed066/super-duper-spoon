import { Repository } from 'typeorm'

import { AppDataSource } from '../../database/data-source.js'
import { UserRole } from '../users/enums/user-role.enum.js'
import { RestaurantMembershipRole } from './enums/restaurant-membership-role.enum.js'
import { Restaurant } from './entities/restaurant.entity.js'
import { RestaurantUser } from './entities/restaurant-user.entity.js'

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
    const normalizedUserId = this.normalizeId(userId)
    const normalizedRestaurantId = this.normalizeId(restaurantId)

    if (!normalizedUserId || !normalizedRestaurantId) {
      return false
    }

    if (systemRole === UserRole.OWNER) {
      return this.restaurantRepository.exists({
        where: {
          id: normalizedRestaurantId
        }
      })
    }

    const membershipRole = this.resolveMembershipRole(systemRole)

    if (!membershipRole) {
      return false
    }

    return this.restaurantUserRepository.exists({
      where: {
        restaurantId: normalizedRestaurantId,
        userId: normalizedUserId,
        role: membershipRole,
        isActive: true
      }
    })
  }

  async isRestaurantOwner(userId: string, restaurantId: string): Promise<boolean> {
    return this.hasMembership(userId, restaurantId, RestaurantMembershipRole.OWNER)
  }

  async isRestaurantManager(userId: string, restaurantId: string): Promise<boolean> {
    return this.hasMembership(userId, restaurantId, RestaurantMembershipRole.MANAGER)
  }

  async getAccessibleRestaurantIds(
    userId: string,
    systemRole: UserRole
  ): Promise<string[]> {
    const normalizedUserId = this.normalizeId(userId)

    if (!normalizedUserId) {
      return []
    }

    if (systemRole === UserRole.OWNER) {
      const restaurants = await this.restaurantRepository.find({
        select: {
          id: true
        }
      })

      return restaurants.map((restaurant) => restaurant.id)
    }

    const membershipRole = this.resolveMembershipRole(systemRole)

    if (!membershipRole) {
      return []
    }

    const memberships = await this.restaurantUserRepository.find({
      select: {
        restaurantId: true
      },
      where: {
        userId: normalizedUserId,
        role: membershipRole,
        isActive: true
      }
    })

    return memberships.map((membership) => membership.restaurantId)
  }

  private async hasMembership(
    userId: string,
    restaurantId: string,
    membershipRole: RestaurantMembershipRole
  ): Promise<boolean> {
    const normalizedUserId = this.normalizeId(userId)
    const normalizedRestaurantId = this.normalizeId(restaurantId)

    if (!normalizedUserId || !normalizedRestaurantId) {
      return false
    }

    return this.restaurantUserRepository.exists({
      where: {
        restaurantId: normalizedRestaurantId,
        userId: normalizedUserId,
        role: membershipRole,
        isActive: true
      }
    })
  }

  private normalizeId(value: string): string {
    return value.trim()
  }

  private resolveMembershipRole(
    systemRole: UserRole
  ): RestaurantMembershipRole | null {
    if (systemRole === UserRole.CLIENT) {
      return RestaurantMembershipRole.OWNER
    }

    if (systemRole === UserRole.MANAGER) {
      return RestaurantMembershipRole.MANAGER
    }

    return null
  }
}
