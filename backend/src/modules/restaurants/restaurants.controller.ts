import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/entities/user.entity';

import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import {
  RestaurantDataResponseDto,
  RestaurantsListResponseDto,
} from './dto/restaurants-swagger-response.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { RestaurantsService } from './restaurants.service';

@UseGuards(JwtAuthGuard)
@ApiTags('Restaurants')
@ApiBearerAuth()
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  @ApiOperation({ summary: 'Create restaurant' })
  @ApiCreatedResponse({ type: RestaurantDataResponseDto })
  @ApiConflictResponse({ description: 'Slug is already in use' })
  create(@CurrentUser() user: User, @Body() dto: CreateRestaurantDto) {
    return this.restaurantsService.create(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get current user restaurants' })
  @ApiOkResponse({ type: RestaurantsListResponseDto })
  findAll(@CurrentUser() user: User) {
    return this.restaurantsService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get restaurant by id' })
  @ApiOkResponse({ type: RestaurantDataResponseDto })
  @ApiNotFoundResponse({ description: 'Restaurant not found' })
  @ApiForbiddenResponse({
    description: 'User does not have access to this restaurant',
  })
  findOne(@CurrentUser() user: User, @Param('id') id: string) {
    return this.restaurantsService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update restaurant' })
  @ApiOkResponse({ type: RestaurantDataResponseDto })
  @ApiNotFoundResponse({ description: 'Restaurant not found' })
  @ApiForbiddenResponse({
    description: 'User does not have permission to manage this restaurant',
  })
  @ApiConflictResponse({ description: 'Slug is already in use' })
  update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() dto: UpdateRestaurantDto,
  ) {
    return this.restaurantsService.update(id, user.id, dto);
  }
}
