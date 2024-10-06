import '@conf/__boot';
import { EnvConfig } from '@conf/env.config';

import { ExceptionFilter } from '@core/filters/exception.filter';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { FasitfyCookieSigner, FastifyConfig } from '@conf/fastify.config';
import { Logger } from 'nestjs-pino';
import { MainModule } from './main.module';
import { NestFactory } from '@nestjs/core';
import { QueryFilterInterceptor } from '@core/interceptors/query-filter.interceptor';
import { QueryPageInterceptor } from '@core/interceptors/query-page.interceptor';
import { RequestInterceptor } from '@core/interceptors/request.interceptor';
import { ResponseInterceptor } from '@core/interceptors/response.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { ValidatorConfig } from '@conf/validator.config';
import { fastifyCookie } from '@fastify/cookie';

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter(FastifyConfig);

  const app = await NestFactory.create<NestFastifyApplication>(MainModule, fastifyAdapter, { bufferLogs: true });
  if (EnvConfig.Const().IS_PRODUCTION) {
    app.useLogger(app.get(Logger));
  }

  await app.register(fastifyCookie, { secret: FasitfyCookieSigner });

  app.enableCors({ origin: '*' });
  app.useGlobalPipes(new ValidationPipe(ValidatorConfig));
  app.useGlobalFilters(new ExceptionFilter());
  app.useGlobalInterceptors(
    new RequestInterceptor(),
    new QueryFilterInterceptor(),
    new QueryPageInterceptor(),
    new ResponseInterceptor(),
  );

  await app.listen(EnvConfig.Const().PORT, '0.0.0.0');
}

void bootstrap();
