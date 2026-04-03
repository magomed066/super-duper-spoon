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
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/entities/user.entity';

import { CreateRestaurantDto } from './dto/create-restaurant.dto';
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
  create(@CurrentUser() user: User, @Body() dto: CreateRestaurantDto) {
    return this.restaurantsService.create(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get current user restaurants' })
  findAll(@CurrentUser() user: User) {
    return this.restaurantsService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get restaurant by id' })
  findOne(@CurrentUser() user: User, @Param('id') id: string) {
    return this.restaurantsService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update restaurant' })
  update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() dto: UpdateRestaurantDto,
  ) {
    return this.restaurantsService.update(id, user.id, dto);
  }
}
