import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { UserResponseDto } from './user-response.dto';

export class UsersListMetaDto {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;

  @ApiProperty({ example: 57 })
  total: number;
}

export class UserDataResponseDto {
  @ApiProperty({ type: () => UserResponseDto })
  data: UserResponseDto;
}

export class UsersListResponseDto {
  @ApiProperty({ type: () => UserResponseDto, isArray: true })
  data: UserResponseDto[];

  @ApiPropertyOptional({ type: () => UsersListMetaDto })
  meta?: UsersListMetaDto;
}
