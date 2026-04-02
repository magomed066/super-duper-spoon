import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailClient {
  private readonly logger = new Logger(MailClient.name);

  async sendWelcomeEmail(email: string): Promise<void> {
    this.logger.log(`Welcome email queued for ${email}`);
  }
}
