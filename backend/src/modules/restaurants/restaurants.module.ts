import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

import { RestaurantMember } from './entities/restaurant-member.entity';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantMembersController } from './restaurant-members.controller';
import { RestaurantMembersService } from './restaurant-members.service';
import { RestaurantsAccessService } from './restaurants-access.service';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Restaurant, RestaurantMember]),
    UsersModule,
    AuthModule,
  ],
  controllers: [RestaurantsController, RestaurantMembersController],
  providers: [
    RestaurantsService,
    RestaurantsAccessService,
    RestaurantMembersService,
  ],
  exports: [RestaurantsService, RestaurantsAccessService, RestaurantMembersService],
})
export class RestaurantsModule {}
