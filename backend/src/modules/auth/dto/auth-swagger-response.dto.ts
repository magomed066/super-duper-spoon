import { ApiProperty } from '@nestjs/swagger';

import { UserResponseDto } from '../../users/dto/user-response.dto';

export class AuthMeResponseDto {
  @ApiProperty({ type: () => UserResponseDto })
  data: UserResponseDto;
}

export class LogoutResponseDto {
  @ApiProperty({ example: true })
  success: true;
}
