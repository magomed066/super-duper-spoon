import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/entities/user.entity';

import { CreateRestaurantMemberDto } from './dto/create-restaurant-member.dto';
import { RestaurantMemberResponseDto } from './dto/restaurant-member-response.dto';
import { UpdateRestaurantMemberDto } from './dto/update-restaurant-member.dto';
import { RestaurantMembersService } from './restaurant-members.service';

@ApiTags('Restaurant Members')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('restaurants/:restaurantId/members')
export class RestaurantMembersController {
  constructor(
    private readonly restaurantMembersService: RestaurantMembersService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get restaurant members',
    description:
      'Available for OWNER, ADMIN, MANAGER. Returns active and inactive memberships inside the requested restaurant only.',
  })
  @ApiResponse({ status: 200, type: RestaurantMemberResponseDto, isArray: true })
  @ApiResponse({
    status: 403,
    schema: {
      example: {
        statusCode: 403,
        message: 'You do not have permission to view restaurant members',
        error: 'Forbidden',
      },
    },
  })
  findAll(@Param('restaurantId') restaurantId: string, @CurrentUser() user: User) {
    return this.restaurantMembersService.findAll(restaurantId, user.id);
  }

  @Post()
  @ApiOperation({
    summary: 'Add restaurant member',
    description:
      'Available for OWNER and ADMIN. Existing user is linked by email; otherwise a new active user is created with a temporary password.',
  })
  @ApiResponse({ status: 201, type: RestaurantMemberResponseDto })
  @ApiResponse({
    status: 409,
    schema: {
      example: {
        statusCode: 409,
        message: 'User is already an active member',
        error: 'Conflict',
      },
    },
  })
  create(
    @Param('restaurantId') restaurantId: string,
    @CurrentUser() user: User,
    @Body() dto: CreateRestaurantMemberDto,
  ) {
    return this.restaurantMembersService.create(restaurantId, user.id, dto);
  }

  @Patch(':memberId')
  @ApiOperation({
    summary: 'Change restaurant member role',
    description:
      'Available for OWNER and ADMIN. Only OWNER can assign OWNER. Last OWNER protection is enforced.',
  })
  @ApiResponse({ status: 200, type: RestaurantMemberResponseDto })
  @ApiResponse({
    status: 403,
    schema: {
      example: {
        statusCode: 403,
        message: 'Only OWNER can assign the OWNER role',
        error: 'Forbidden',
      },
    },
  })
  update(
    @Param('restaurantId') restaurantId: string,
    @Param('memberId') memberId: string,
    @CurrentUser() user: User,
    @Body() dto: UpdateRestaurantMemberDto,
  ) {
    return this.restaurantMembersService.update(
      restaurantId,
      memberId,
      user.id,
      dto,
    );
  }

  @Delete(':memberId')
  @ApiOperation({
    summary: 'Deactivate restaurant member',
    description:
      'Available for OWNER and ADMIN. The member is not deleted from the database; membership is marked inactive.',
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        success: true,
      },
    },
  })
  @ApiResponse({
    status: 403,
    schema: {
      example: {
        statusCode: 403,
        message: 'You cannot remove the last OWNER from this restaurant',
        error: 'Forbidden',
      },
    },
  })
  deactivate(
    @Param('restaurantId') restaurantId: string,
    @Param('memberId') memberId: string,
    @CurrentUser() user: User,
  ) {
    return this.restaurantMembersService.deactivate(
      restaurantId,
      memberId,
      user.id,
    );
  }
}
