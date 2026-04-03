import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { ApiResponse } from '@/common/types/api-response.type';

import { CreateUserDto } from './dto/create-user.dto';
import { ListUsersQueryDto } from './dto/list-users-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserStatus } from './entities/user-status.enum';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(
    payload: Omit<CreateUserDto, 'password'> & {
      passwordHash: string;
      status?: UserStatus;
    },
  ): Promise<User> {
    await this.ensureUniqueFields(payload.email, payload.phone);

    const user = this.usersRepository.create({
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phone: payload.phone,
      passwordHash: payload.passwordHash,
      status: payload.status ?? UserStatus.ACTIVE,
    });

    return this.usersRepository.save(user);
  }

  async findAll(
    query: ListUsersQueryDto,
  ): Promise<ApiResponse<UserResponseDto[]>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const where = query.search
      ? [
          { email: ILike(`%${query.search}%`) },
          { phone: ILike(`%${query.search}%`) },
          { firstName: ILike(`%${query.search}%`) },
          { lastName: ILike(`%${query.search}%`) },
        ]
      : undefined;

    const [users, total] = await this.usersRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: users.map(UserResponseDto.fromEntity),
      meta: {
        page,
        limit,
        total,
      },
    };
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email: email.trim().toLowerCase() },
    });
  }

  async getById(id: string): Promise<ApiResponse<UserResponseDto>> {
    const user = await this.findById(id);

    return {
      data: UserResponseDto.fromEntity(user),
    };
  }

  async update(
    id: string,
    payload: Partial<{
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      passwordHash: string;
      status: UserStatus;
    }>,
  ): Promise<User> {
    const user = await this.findById(id);

    if (payload.email && payload.email !== user.email) {
      await this.ensureEmailAvailable(payload.email);
    }

    if (payload.phone && payload.phone !== user.phone) {
      await this.ensurePhoneAvailable(payload.phone);
    }

    const nextValues = Object.fromEntries(
      Object.entries(payload).filter(([, value]) => value !== undefined),
    );

    Object.assign(user, nextValues);

    return this.usersRepository.save(user);
  }

  async updateUser(
    id: string,
    dto: UpdateUserDto,
    passwordHash?: string,
  ): Promise<ApiResponse<UserResponseDto>> {
    const user = await this.update(id, {
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
      passwordHash,
      status: dto.status,
    });

    return {
      data: UserResponseDto.fromEntity(user),
    };
  }

  async updateRefreshTokenHash(
    userId: string,
    refreshTokenHash: string | null,
  ): Promise<void> {
    await this.findById(userId);

    await this.usersRepository.update(userId, {
      refreshTokenHash,
    });
  }

  private async ensureUniqueFields(email: string, phone: string): Promise<void> {
    await Promise.all([
      this.ensureEmailAvailable(email),
      this.ensurePhoneAvailable(phone),
    ]);
  }

  private async ensureEmailAvailable(email: string): Promise<void> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: email.trim().toLowerCase() },
      select: { id: true },
    });

    if (existingUser) {
      throw new ConflictException('Email is already in use');
    }
  }

  private async ensurePhoneAvailable(phone: string): Promise<void> {
    const existingUser = await this.usersRepository.findOne({
      where: { phone: phone.trim() },
      select: { id: true },
    });

    if (existingUser) {
      throw new ConflictException('Phone is already in use');
    }
  }
}
