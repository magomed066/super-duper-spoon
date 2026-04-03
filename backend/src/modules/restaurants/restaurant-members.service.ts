import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { DataSource, Repository } from 'typeorm';

import { ApiResponse } from '@/common/types/api-response.type';
import { PasswordService } from '@/modules/auth/password.service';
import { UserStatus } from '@/modules/users/entities/user-status.enum';
import { User } from '@/modules/users/entities/user.entity';
import { UsersService } from '@/modules/users/users.service';

import { CreateRestaurantMemberDto } from './dto/create-restaurant-member.dto';
import { RestaurantMemberResponseDto } from './dto/restaurant-member-response.dto';
import { UpdateRestaurantMemberDto } from './dto/update-restaurant-member.dto';
import { RestaurantMemberRole } from './entities/restaurant-member-role.enum';
import { RestaurantMember } from './entities/restaurant-member.entity';
import {
  assertCanAssignRestaurantRole,
  assertCanManageRestaurantMembers,
  assertCanViewRestaurantMembers,
} from './restaurant-members.permissions';
import { RestaurantsAccessService } from './restaurants-access.service';

@Injectable()
export class RestaurantMembersService {
  constructor(
    @InjectRepository(RestaurantMember)
    private readonly membersRepository: Repository<RestaurantMember>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly restaurantsAccessService: RestaurantsAccessService,
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
  ) {}

  async findAll(
    restaurantId: string,
    actorUserId: string,
  ): Promise<ApiResponse<RestaurantMemberResponseDto[]>> {
    const context =
      await this.restaurantsAccessService.getAccessibleRestaurantOrFail(
        restaurantId,
        actorUserId,
      );

    assertCanViewRestaurantMembers(context.membership);

    const members = await this.membersRepository.find({
      where: { restaurantId },
      relations: { user: true },
      order: {
        isActive: 'DESC',
        createdAt: 'ASC',
      },
    });

    return {
      data: members.map(RestaurantMemberResponseDto.fromEntity),
    };
  }

  async create(
    restaurantId: string,
    actorUserId: string,
    dto: CreateRestaurantMemberDto,
  ): Promise<ApiResponse<RestaurantMemberResponseDto>> {
    const context =
      await this.restaurantsAccessService.getAccessibleRestaurantOrFail(
        restaurantId,
        actorUserId,
      );

    assertCanManageRestaurantMembers(context.membership);
    assertCanAssignRestaurantRole(context.membership, dto.role);

    const user = await this.findOrCreateUser(dto);
    const existingMember = await this.membersRepository.findOne({
      where: {
        restaurantId,
        userId: user.id,
      },
      relations: { user: true },
    });

    if (existingMember?.isActive) {
      throw new ConflictException('User is already an active member');
    }

    const member = await this.dataSource.transaction(async (manager) => {
      const membersRepository = manager.getRepository(RestaurantMember);

      const preparedMember = existingMember
        ? Object.assign(existingMember, {
            role: dto.role,
            isActive: true,
          })
        : membersRepository.create({
            restaurantId,
            userId: user.id,
            role: dto.role,
            isActive: true,
          });

      const savedMember = await membersRepository.save(preparedMember);

      if (dto.role === RestaurantMemberRole.OWNER) {
        await this.restaurantsAccessService.setPrimaryOwner(
          manager,
          restaurantId,
          savedMember.userId,
        );
      }

      return membersRepository.findOneOrFail({
        where: { id: savedMember.id },
        relations: { user: true },
      });
    });

    return {
      data: RestaurantMemberResponseDto.fromEntity(member),
    };
  }

  async update(
    restaurantId: string,
    memberId: string,
    actorUserId: string,
    dto: UpdateRestaurantMemberDto,
  ): Promise<ApiResponse<RestaurantMemberResponseDto>> {
    const { actorMembership, targetMembership } =
      await this.restaurantsAccessService.getRestaurantMemberAccessContextOrFail(
        restaurantId,
        actorUserId,
        memberId,
      );

    assertCanManageRestaurantMembers(actorMembership);
    assertCanAssignRestaurantRole(actorMembership, dto.role);

    if (!targetMembership.isActive) {
      throw new ConflictException(
        'Inactive member cannot be updated. Add the member again to reactivate access',
      );
    }

    if (targetMembership.role === dto.role) {
      return {
        data: RestaurantMemberResponseDto.fromEntity(targetMembership),
      };
    }

    const previousRole = targetMembership.role;

    await this.ensureOwnerConstraints({
      restaurantId,
      actorMembership,
      targetMembership,
      nextRole: dto.role,
      deactivate: false,
    });

    const member = await this.dataSource.transaction(async (manager) => {
      const membersRepository = manager.getRepository(RestaurantMember);
      targetMembership.role = dto.role;
      const savedMember = await membersRepository.save(targetMembership);

      if (dto.role === RestaurantMemberRole.OWNER) {
        await this.restaurantsAccessService.setPrimaryOwner(
          manager,
          restaurantId,
          savedMember.userId,
        );
      } else if (previousRole === RestaurantMemberRole.OWNER) {
        await this.restaurantsAccessService.syncPrimaryOwnerFromActiveOwners(
          manager,
          restaurantId,
        );
      }

      return membersRepository.findOneOrFail({
        where: { id: savedMember.id },
        relations: { user: true },
      });
    });

    return {
      data: RestaurantMemberResponseDto.fromEntity(member),
    };
  }

  async deactivate(
    restaurantId: string,
    memberId: string,
    actorUserId: string,
  ): Promise<{ success: true }> {
    const { actorMembership, targetMembership } =
      await this.restaurantsAccessService.getRestaurantMemberAccessContextOrFail(
        restaurantId,
        actorUserId,
        memberId,
      );

    assertCanManageRestaurantMembers(actorMembership);

    if (!targetMembership.isActive) {
      return { success: true };
    }

    await this.ensureOwnerConstraints({
      restaurantId,
      actorMembership,
      targetMembership,
      deactivate: true,
    });

    await this.dataSource.transaction(async (manager) => {
      const membersRepository = manager.getRepository(RestaurantMember);
      targetMembership.isActive = false;
      await membersRepository.save(targetMembership);
      await this.restaurantsAccessService.syncPrimaryOwnerFromActiveOwners(
        manager,
        restaurantId,
      );
    });

    return { success: true };
  }

  private async findOrCreateUser(
    dto: CreateRestaurantMemberDto,
  ): Promise<User> {
    const existingUser = await this.usersService.findByEmail(dto.email);

    if (existingUser) {
      return existingUser;
    }

    const temporaryPassword = randomBytes(18).toString('base64url');
    const passwordHash = await this.passwordService.hash(temporaryPassword);

    return this.usersService.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
      passwordHash,
      status: UserStatus.ACTIVE,
    });
  }

  private async ensureOwnerConstraints(params: {
    restaurantId: string;
    actorMembership: RestaurantMember;
    targetMembership: RestaurantMember;
    nextRole?: RestaurantMemberRole;
    deactivate: boolean;
  }): Promise<void> {
    const { restaurantId, actorMembership, targetMembership, nextRole, deactivate } =
      params;

    const removesOwnerPrivilege =
      targetMembership.role === RestaurantMemberRole.OWNER &&
      (deactivate || nextRole !== RestaurantMemberRole.OWNER);

    if (!removesOwnerPrivilege) {
      return;
    }

    const activeOwnersCount = await this.membersRepository.count({
      where: {
        restaurantId,
        role: RestaurantMemberRole.OWNER,
        isActive: true,
      },
    });

    if (activeOwnersCount > 1) {
      return;
    }

    throw new ForbiddenException(
      actorMembership.userId === targetMembership.userId
        ? 'You cannot remove your own last OWNER access'
        : 'You cannot remove the last OWNER from this restaurant',
    );
  }
}
