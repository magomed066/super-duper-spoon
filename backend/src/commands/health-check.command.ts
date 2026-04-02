import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class HealthCheckCommand {
  private readonly logger = new Logger(HealthCheckCommand.name);

  run(): void {
    this.logger.log('Health check command executed');
  }
}
