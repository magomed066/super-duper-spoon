import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import type { JwtModuleOptions } from '@nestjs/jwt';

import { AppConfigService } from '@/core/config/app-config.service';
import { UsersModule } from '../users/users.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthTokenService } from './auth-token.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { PasswordService } from './password.service';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.registerAsync({
      inject: [AppConfigService],
      useFactory: (appConfigService: AppConfigService): JwtModuleOptions => ({
        secret: appConfigService.jwtSecret,
        signOptions: {
          expiresIn: appConfigService.jwtAccessExpiresIn,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthTokenService, PasswordService, JwtAuthGuard],
  exports: [
    AuthService,
    AuthTokenService,
    PasswordService,
    JwtAuthGuard,
    JwtModule,
  ],
})
export class AuthModule {}
