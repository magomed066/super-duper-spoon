import { Module } from '@nestjs/common';

import { MailClient } from './mail/mail.client';

@Module({
  providers: [MailClient],
  exports: [MailClient],
})
export class IntegrationsModule {}
