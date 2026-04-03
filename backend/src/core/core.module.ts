import { Global, Module } from '@nestjs/common';

import { AppConfigService } from './config/app-config.service';
import { DatabaseModule } from './database/database.module';

@Global()
@Module({
  imports: [DatabaseModule],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class CoreModule {}
