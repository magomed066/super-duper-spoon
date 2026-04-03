import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { RestaurantMemberRole } from '../entities/restaurant-member-role.enum';

const normalizeEmail = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim().toLowerCase() : value;

const normalizePhone = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class CreateRestaurantMemberDto {
  @ApiProperty({ example: 'anna@example.com' })
  @Transform(normalizeEmail)
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({ example: '+79991234567' })
  @Transform(normalizePhone)
  @IsString()
  @MaxLength(30)
  phone: string;

  @ApiProperty({ example: 'Anna' })
  @IsString()
  @MaxLength(100)
  firstName: string;

  @ApiProperty({ example: 'Petrova' })
  @IsString()
  @MaxLength(100)
  lastName: string;

  @ApiProperty({ enum: RestaurantMemberRole, example: RestaurantMemberRole.MANAGER })
  @IsEnum(RestaurantMemberRole)
  role: RestaurantMemberRole;
}
