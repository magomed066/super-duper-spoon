import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RestaurantMemberRole } from './entities/restaurant-member-role.enum';
import { RestaurantMember } from './entities/restaurant-member.entity';
import { Restaurant } from './entities/restaurant.entity';

type RestaurantAccessContext = {
  restaurant: Restaurant;
  membership: RestaurantMember;
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
}
