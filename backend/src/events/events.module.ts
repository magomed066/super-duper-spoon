import { Module } from '@nestjs/common';

import { DomainEventsPublisher } from './publishers/domain-events.publisher';

@Module({
  providers: [DomainEventsPublisher],
  exports: [DomainEventsPublisher],
})
export class EventsModule {}
