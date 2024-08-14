import '@conf/__boot';
import { EnvConfig } from '@conf/env.config';

import { Logger } from 'nestjs-pino';
import { MainModule } from './main.module';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { FastifyConfig } from '@conf/fastify.config';

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter(FastifyConfig);

  const app = await NestFactory.create<NestFastifyApplication>(MainModule, fastifyAdapter, { bufferLogs: true });
  if (EnvConfig.Const().IS_PRODUCTION) {
    app.useLogger(app.get(Logger));
  }

  await app.listen(EnvConfig.Const().PORT);
}

void bootstrap();
