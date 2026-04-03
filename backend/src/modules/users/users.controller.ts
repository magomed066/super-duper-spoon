import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PasswordService } from '../auth/password.service';

import { CreateUserDto } from './dto/create-user.dto';
import { ListUsersQueryDto } from './dto/list-users-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import {
  UserDataResponseDto,
  UsersListResponseDto,
} from './dto/users-swagger-response.dto';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard)
@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiCreatedResponse({ type: UserDataResponseDto })
  @ApiConflictResponse({
    description: 'Email or phone is already in use',
  })
  async create(@Body() dto: CreateUserDto) {
    const passwordHash = await this.passwordService.hash(dto.password);
    const user = await this.usersService.create({
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

  @Get()
  @ApiOperation({ summary: 'Get users list' })
  @ApiOkResponse({ type: UsersListResponseDto })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  findAll(@Query() query: ListUsersQueryDto) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiOkResponse({ type: UserDataResponseDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  getById(@Param('id') id: string) {
    return this.usersService.getById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiOkResponse({ type: UserDataResponseDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiConflictResponse({
    description: 'Email or phone is already in use',
  })
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const passwordHash = dto.password
      ? await this.passwordService.hash(dto.password)
      : undefined;

    return this.usersService.updateUser(id, dto, passwordHash);
  }
}
