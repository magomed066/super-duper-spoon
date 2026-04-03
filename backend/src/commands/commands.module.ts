import { Module } from '@nestjs/common';

import { HealthCheckCommand } from './health-check.command';

@Module({
  providers: [HealthCheckCommand],
  exports: [HealthCheckCommand],
})
export class CommandsModule {}
