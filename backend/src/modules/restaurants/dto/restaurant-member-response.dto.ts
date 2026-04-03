import { ApiProperty } from '@nestjs/swagger';

import { UserStatus } from '@/modules/users/entities/user-status.enum';
import { RestaurantMemberRole } from '../entities/restaurant-member-role.enum';
import { RestaurantMember } from '../entities/restaurant-member.entity';

export class RestaurantMemberResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  restaurantId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty({ enumName: 'UserStatus', enum: UserStatus })
  userStatus: UserStatus;

  @ApiProperty({ enumName: 'RestaurantMemberRole', enum: RestaurantMemberRole })
  role: RestaurantMemberRole;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static fromEntity(member: RestaurantMember): RestaurantMemberResponseDto {
    return {
      id: member.id,
      restaurantId: member.restaurantId,
      userId: member.userId,
      firstName: member.user.firstName,
      lastName: member.user.lastName,
      email: member.user.email,
      phone: member.user.phone,
      userStatus: member.user.status,
      role: member.role,
      isActive: member.isActive,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
    };
  }
}
