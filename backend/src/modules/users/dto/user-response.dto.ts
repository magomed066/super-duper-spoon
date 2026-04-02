import { UserStatus } from '../entities/user-status.enum';
import { User } from '../entities/user.entity';

export class UserResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: UserStatus;
  createdAt: Date;
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
