import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { RestaurantMemberRole } from './entities/restaurant-member-role.enum';
import { RestaurantMember } from './entities/restaurant-member.entity';
import { Restaurant } from './entities/restaurant.entity';

type RestaurantAccessContext = {
  restaurant: Restaurant;
  membership: RestaurantMember;
};

type RestaurantMemberAccessContext = {
  restaurant: Restaurant;
  actorMembership: RestaurantMember;
  targetMembership: RestaurantMember;
};

@Injectable()
export class RestaurantsAccessService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantsRepository: Repository<Restaurant>,
    @InjectRepository(RestaurantMember)
    private readonly membersRepository: Repository<RestaurantMember>,
  ) {}

  async getAccessibleRestaurantOrFail(
    restaurantId: string,
    userId: string,
  ): Promise<RestaurantAccessContext> {
    const membership = await this.membersRepository.findOne({
      where: {
        restaurantId,
        userId,
        isActive: true,
      },
    });

    if (!membership) {
      throw new NotFoundException('Restaurant not found');
    }

    const restaurant = await this.restaurantsRepository.findOne({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    return { restaurant, membership };
  }

  async getManageableRestaurantOrFail(
    restaurantId: string,
    userId: string,
  ): Promise<RestaurantAccessContext> {
    const context = await this.getAccessibleRestaurantOrFail(restaurantId, userId);

    if (
      context.membership.role !== RestaurantMemberRole.OWNER &&
      context.membership.role !== RestaurantMemberRole.ADMIN
    ) {
      throw new ForbiddenException(
        'You do not have permission to update this restaurant',
      );
    }

    return context;
  }

  async getRestaurantMemberAccessContextOrFail(
    restaurantId: string,
    actorUserId: string,
    memberId: string,
  ): Promise<RestaurantMemberAccessContext> {
    const context = await this.getAccessibleRestaurantOrFail(
      restaurantId,
      actorUserId,
    );

    const targetMembership = await this.membersRepository.findOne({
      where: {
        id: memberId,
        restaurantId,
      },
      relations: {
        user: true,
      },
    });

    if (!targetMembership) {
      throw new NotFoundException('Restaurant member not found');
    }

    return {
      restaurant: context.restaurant,
      actorMembership: context.membership,
      targetMembership,
    };
  }

  async setPrimaryOwner(
    manager: EntityManager,
    restaurantId: string,
    userId: string,
  ): Promise<void> {
    await manager.getRepository(Restaurant).update(restaurantId, {
      ownerUserId: userId,
    });
  }

  async syncPrimaryOwnerFromActiveOwners(
    manager: EntityManager,
    restaurantId: string,
  ): Promise<void> {
    const membersRepository = manager.getRepository(RestaurantMember);
    const restaurantsRepository = manager.getRepository(Restaurant);
    const fallbackOwner = await membersRepository.findOne({
      where: {
        restaurantId,
        role: RestaurantMemberRole.OWNER,
        isActive: true,
      },
      order: {
        createdAt: 'ASC',
      },
    });

    if (!fallbackOwner) {
      return;
    }

    await restaurantsRepository.update(restaurantId, {
      ownerUserId: fallbackOwner.userId,
    });
  }
}
