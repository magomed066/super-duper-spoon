import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { RestaurantMemberRole } from '../entities/restaurant-member-role.enum';

export class UpdateRestaurantMemberDto {
  @ApiProperty({ enum: RestaurantMemberRole, example: RestaurantMemberRole.ADMIN })
  @IsEnum(RestaurantMemberRole)
  role: RestaurantMemberRole;
}
