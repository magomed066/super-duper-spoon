import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class DomainEventsPublisher {
  private readonly logger = new Logger(DomainEventsPublisher.name);

  publish(eventName: string, payload: Record<string, unknown>): void {
    this.logger.debug({ eventName, payload });
  }
}
