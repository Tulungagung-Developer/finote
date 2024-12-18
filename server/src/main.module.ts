import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { ControllerModule } from '@ctrl/controller.module';
import { CoreModule } from '@core/core.module';
import { EnvConfig } from '@conf/env.config';
import { LoggerModule } from 'nestjs-pino';
import { SentryModule } from '@sentry/nestjs/setup';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from '@conf/database.config';

@Module({})
class ProductionModule {
  static register(): DynamicModule {
    const module = {
      module: ProductionModule,
      imports: [] as DynamicModule[],
      providers: [] as Provider[],
    };

    if (EnvConfig.Const().IS_PRODUCTION) {
      module.imports.push(LoggerModule.forRoot());

      if (EnvConfig.get('SERVER_SENTRY_DSN').value) {
        module.imports.push(SentryModule.forRoot());
      }

      return module;
    }

    return {
      module: ProductionModule,
    };
  }
}

@Global()
@Module({
  imports: [
    ProductionModule.register(),
    ControllerModule,
    CoreModule,
    TypeOrmModule.forRoot({ ...DatabaseConfig, autoLoadEntities: true }),
  ],
  exports: [CoreModule],
})
export class MainModule {}
