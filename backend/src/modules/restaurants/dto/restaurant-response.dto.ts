import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { RestaurantMemberRole } from '../entities/restaurant-member-role.enum';
import { RestaurantMember } from '../entities/restaurant-member.entity';
import { Restaurant } from '../entities/restaurant.entity';

export class RestaurantResponseDto {
  @ApiProperty({ example: 'b2fcae70-5e34-4e9d-9e32-e1f4c4d0a812' })
  id: string;

  @ApiProperty({ example: 'North Fork' })
  name: string;

  @ApiProperty({ example: 'north-fork' })
  slug: string;

  @ApiProperty({
    example: 'Modern европейская кухня и сезонное меню.',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    example: 'https://cdn.example.com/restaurants/north-fork.jpg',
    nullable: true,
  })
  image: string | null;

  @ApiProperty({ example: '+74951234567', nullable: true })
  phone: string | null;

  @ApiProperty({ example: 'Moscow, Tverskaya 10', nullable: true })
  address: string | null;

  @ApiProperty({ example: 'Europe/Moscow' })
  timezone: string;

  @ApiProperty({ example: 'RUB' })
  currency: string;

  @ApiProperty({ example: '6f2c8d53-820d-4e2a-8d02-1aafec95bbf2' })
  ownerUserId: string;

  @ApiPropertyOptional({
    enum: RestaurantMemberRole,
    enumName: 'RestaurantMemberRole',
    example: RestaurantMemberRole.OWNER,
  })
  currentUserRole?: RestaurantMemberRole;

  @ApiProperty({ example: '2026-04-03T10:15:00.000Z', format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ example: '2026-04-03T10:30:00.000Z', format: 'date-time' })
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
