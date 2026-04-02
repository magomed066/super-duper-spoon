import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { User } from '../users/entities/user.entity';

import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: CreateUserDto): Promise<AuthResponseDto> {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: User) {
    return this.authService.me(user.id);
  }
}
