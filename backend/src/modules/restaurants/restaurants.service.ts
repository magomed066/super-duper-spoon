import { ConflictException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';

import { ApiResponse } from '@/common/types/api-response.type';

import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { RestaurantResponseDto } from './dto/restaurant-response.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { RestaurantMemberRole } from './entities/restaurant-member-role.enum';
import { RestaurantMember } from './entities/restaurant-member.entity';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantsAccessService } from './restaurants-access.service';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantsRepository: Repository<Restaurant>,
    @InjectRepository(RestaurantMember)
    private readonly membersRepository: Repository<RestaurantMember>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly restaurantsAccessService: RestaurantsAccessService,
  ) {}

  async create(
    userId: string,
    dto: CreateRestaurantDto,
  ): Promise<ApiResponse<RestaurantResponseDto>> {
    await this.ensureSlugAvailable(dto.slug);

    const restaurant = await this.dataSource.transaction(async (manager) => {
      const restaurantsRepository = manager.getRepository(Restaurant);
      const membersRepository = manager.getRepository(RestaurantMember);

      const createdRestaurant = await restaurantsRepository.save(
        restaurantsRepository.create({
          name: dto.name,
          slug: dto.slug,
          description: dto.description ?? null,
          image: dto.image ?? null,
          phone: dto.phone ?? null,
          address: dto.address ?? null,
          timezone: dto.timezone,
          currency: dto.currency,
          ownerUserId: userId,
        }),
      );

      await membersRepository.save(
        membersRepository.create({
          restaurantId: createdRestaurant.id,
          userId,
          role: RestaurantMemberRole.OWNER,
          isActive: true,
        }),
      );

      return createdRestaurant;
    });

    return {
      data: RestaurantResponseDto.fromEntity(restaurant, {
        role: RestaurantMemberRole.OWNER,
      }),
    };
  }

  async findAll(userId: string): Promise<ApiResponse<RestaurantResponseDto[]>> {
    const memberships = await this.membersRepository.find({
      where: {
        userId,
        isActive: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    if (memberships.length === 0) {
      return { data: [] };
    }

    const restaurants = await this.restaurantsRepository.find({
      where: {
        id: In(memberships.map((membership) => membership.restaurantId)),
      },
      order: {
        createdAt: 'DESC',
      },
    });

    const membershipByRestaurantId = new Map(
      memberships.map((membership) => [membership.restaurantId, membership]),
    );

    return {
      data: restaurants.map((restaurant) =>
        RestaurantResponseDto.fromEntity(
          restaurant,
          membershipByRestaurantId.get(restaurant.id),
        ),
      ),
    };
  }

  async findOne(
    restaurantId: string,
    userId: string,
  ): Promise<ApiResponse<RestaurantResponseDto>> {
    const context =
      await this.restaurantsAccessService.getAccessibleRestaurantOrFail(
        restaurantId,
        userId,
      );

    return {
      data: RestaurantResponseDto.fromEntity(
        context.restaurant,
        context.membership,
      ),
    };
  }

  async update(
    restaurantId: string,
    userId: string,
    dto: UpdateRestaurantDto,
  ): Promise<ApiResponse<RestaurantResponseDto>> {
    const context =
      await this.restaurantsAccessService.getManageableRestaurantOrFail(
        restaurantId,
        userId,
      );

    if (dto.slug && dto.slug !== context.restaurant.slug) {
      await this.ensureSlugAvailable(dto.slug);
    }

    const nextValues = Object.fromEntries(
      Object.entries({
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        image: dto.image,
        phone: dto.phone,
        address: dto.address,
        timezone: dto.timezone,
        currency: dto.currency,
      }).filter(([, value]) => value !== undefined),
    );

    Object.assign(context.restaurant, nextValues);

    const restaurant = await this.restaurantsRepository.save(context.restaurant);

    return {
      data: RestaurantResponseDto.fromEntity(restaurant, context.membership),
    };
  }

  private async ensureSlugAvailable(slug: string): Promise<void> {
    const existingRestaurant = await this.restaurantsRepository.findOne({
      where: { slug },
      select: { id: true },
    });

    if (existingRestaurant) {
      throw new ConflictException('Slug is already in use');
    }
  }
}
