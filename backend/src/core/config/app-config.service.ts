import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import type { StringValue } from 'ms';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get port(): number {
    return Number(this.configService.get('PORT', 3000));
  }

  get nodeEnv(): string {
    return this.configService.get('NODE_ENV', 'development');
  }

  get databaseConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get('DATABASE_HOST', 'localhost'),
      port: Number(this.configService.get('DATABASE_PORT', 5432)),
      username: this.configService.get('DATABASE_USER', 'postgres'),
      password: this.configService.get('DATABASE_PASSWORD', 'postgres'),
      database: this.configService.get(
        'DATABASE_NAME',
        'restaurant_management',
      ),
      autoLoadEntities: true,
      synchronize: this.nodeEnv !== 'production',
    };
  }

  get jwtSecret(): string {
    return this.configService.get('JWT_SECRET', 'change-me');
  }

  get jwtExpiresIn(): StringValue {
    return this.configService.get<StringValue>('JWT_EXPIRES_IN', '1d');
  }
}
