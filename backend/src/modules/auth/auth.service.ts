import { Injectable, UnauthorizedException } from '@nestjs/common';

import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { UserStatus } from '../users/entities/user-status.enum';
import { UsersService } from '../users/users.service';

import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthTokenService } from './auth-token.service';
import { PasswordService } from './password.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly authTokenService: AuthTokenService,
  ) {}

  async register(dto: CreateUserDto): Promise<AuthResponseDto> {
    const passwordHash = await this.passwordService.hash(dto.password);
    const user = await this.usersService.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
      passwordHash,
      status: UserStatus.ACTIVE,
    });

    return this.issueTokens(user.id);
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await this.passwordService.compare(
      dto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('User is not active');
    }

    return this.issueTokens(user.id);
  }

  async me(userId: string): Promise<{ data: UserResponseDto }> {
    const user = await this.usersService.findById(userId);

    return {
      data: UserResponseDto.fromEntity(user),
    };
  }

  async refresh(dto: RefreshTokenDto): Promise<AuthResponseDto> {
    const payload = await this.authTokenService.verifyRefreshToken(
      dto.refreshToken,
    );
    const user = await this.usersService.findById(payload.sub);

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('User is not active');
    }

    if (!user.refreshTokenHash) {
      throw new UnauthorizedException('Refresh token is invalid');
    }

    const isRefreshTokenValid = await this.passwordService.compare(
      dto.refreshToken,
      user.refreshTokenHash,
    );

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Refresh token is invalid');
    }

    return this.issueTokens(user.id);
  }

  async logout(dto: LogoutDto): Promise<{ success: true }> {
    const payload = await this.authTokenService.verifyRefreshToken(
      dto.refreshToken,
    );
    const user = await this.usersService.findById(payload.sub);

    if (!user.refreshTokenHash) {
      return { success: true };
    }

    const isRefreshTokenValid = await this.passwordService.compare(
      dto.refreshToken,
      user.refreshTokenHash,
    );

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Refresh token is invalid');
    }

    await this.usersService.updateRefreshTokenHash(user.id, null);

    return { success: true };
  }

  private async issueTokens(userId: string): Promise<AuthResponseDto> {
    const user = await this.usersService.findById(userId);
    const tokens = await this.authTokenService.generateTokenPair(user);
    const refreshTokenHash = await this.passwordService.hash(
      tokens.refreshToken,
    );

    await this.usersService.updateRefreshTokenHash(user.id, refreshTokenHash);

    return {
      ...tokens,
      user: UserResponseDto.fromEntity(user),
    };
  }
}
