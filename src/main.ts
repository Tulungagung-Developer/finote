import '@conf/__boot';
import { EnvConfig } from '@conf/env.config';

import { Logger } from 'nestjs-pino';
import { MainModule } from './main.module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(MainModule, { bufferLogs: true });
  if (EnvConfig.Const().IS_PRODUCTION) {
    app.useLogger(app.get(Logger));
  }

  await app.listen(EnvConfig.Const().PORT);
}

void bootstrap();
