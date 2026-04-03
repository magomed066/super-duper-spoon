import { ApiProperty } from '@nestjs/swagger';

import { RestaurantResponseDto } from './restaurant-response.dto';

export class RestaurantDataResponseDto {
  @ApiProperty({ type: () => RestaurantResponseDto })
  data: RestaurantResponseDto;
}

export class RestaurantsListResponseDto {
  @ApiProperty({ type: () => RestaurantResponseDto, isArray: true })
  data: RestaurantResponseDto[];
}
