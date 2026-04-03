import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RestaurantMember } from './entities/restaurant-member.entity';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantsAccessService } from './restaurants-access.service';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, RestaurantMember])],
  controllers: [RestaurantsController],
  providers: [RestaurantsService, RestaurantsAccessService],
  exports: [RestaurantsService, RestaurantsAccessService],
})
export class RestaurantsModule {}
