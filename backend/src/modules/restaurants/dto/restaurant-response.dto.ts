import { RestaurantMemberRole } from '../entities/restaurant-member-role.enum';
import { RestaurantMember } from '../entities/restaurant-member.entity';
import { Restaurant } from '../entities/restaurant.entity';

export class RestaurantResponseDto {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  phone: string | null;
  address: string | null;
  timezone: string;
  currency: string;
  ownerUserId: string;
  currentUserRole?: RestaurantMemberRole;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(
    restaurant: Restaurant,
    member?: Pick<RestaurantMember, 'role'> | null,
  ): RestaurantResponseDto {
    return {
      id: restaurant.id,
      name: restaurant.name,
      slug: restaurant.slug,
      description: restaurant.description,
      image: restaurant.image,
      phone: restaurant.phone,
      address: restaurant.address,
      timezone: restaurant.timezone,
      currency: restaurant.currency,
      ownerUserId: restaurant.ownerUserId,
      currentUserRole: member?.role,
      createdAt: restaurant.createdAt,
      updatedAt: restaurant.updatedAt,
    };
  }
}
