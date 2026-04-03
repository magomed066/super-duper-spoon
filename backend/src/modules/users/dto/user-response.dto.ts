import { ApiProperty } from '@nestjs/swagger';

import { UserStatus } from '../entities/user-status.enum';
import { User } from '../entities/user.entity';

export class UserResponseDto {
  @ApiProperty({ example: '6f2c8d53-820d-4e2a-8d02-1aafec95bbf2' })
  id: string;

  @ApiProperty({ example: 'Anna' })
  firstName: string;

  @ApiProperty({ example: 'Petrova' })
  lastName: string;

  @ApiProperty({ example: 'anna@example.com', format: 'email' })
  email: string;

  @ApiProperty({ example: '+79991234567' })
  phone: string;

  @ApiProperty({ enum: UserStatus, enumName: 'UserStatus' })
  status: UserStatus;

  @ApiProperty({ example: '2026-04-03T10:15:00.000Z', format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ example: '2026-04-03T10:30:00.000Z', format: 'date-time' })
  updatedAt: Date;

  static fromEntity(user: User): UserResponseDto {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
