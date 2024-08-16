import '@conf/__boot';
import { EnvConfig } from '@conf/env.config';

import { Logger } from 'nestjs-pino';
import { MainModule } from './main.module';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { FastifyConfig } from '@conf/fastify.config';
import { ResponseInterceptor } from '@core/interceptors/response.interceptor';
import { ExceptionFilter } from '@core/filters/exception.filter';

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter(FastifyConfig);

  const app = await NestFactory.create<NestFastifyApplication>(MainModule, fastifyAdapter, { bufferLogs: true });
  if (EnvConfig.Const().IS_PRODUCTION) {
    app.useLogger(app.get(Logger));
  }

  app.enableCors({ origin: '*' });
  app.useGlobalFilters(new ExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(EnvConfig.Const().PORT);
}

void bootstrap();
