import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CommandsModule } from './commands/commands.module';
import { CoreModule } from './core/core.module';
import { EventsModule } from './events/events.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { RestaurantsModule } from './modules/restaurants/restaurants.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CoreModule,
    IntegrationsModule,
    EventsModule,
    CommandsModule,
    AuthModule,
    RestaurantsModule,
    UsersModule,
    HealthModule,
  ],
})
export class AppModule {}
