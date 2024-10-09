import '@conf/__boot';
import { EnvConfig } from '@conf/env.config';

import { DataSourceOptions } from 'typeorm';
import { TypeOrmLoggerContainer } from '@libs/typeorm/logger.typeorm';
import { NamingStrategy } from '@libs/typeorm/naming.typeorm';

export const DatabaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: EnvConfig.Const().DATABASE.HOST,
  port: EnvConfig.Const().DATABASE.PORT,
  username: EnvConfig.Const().DATABASE.USERNAME,
  password: EnvConfig.Const().DATABASE.PASSWORD,
  database: EnvConfig.Const().DATABASE.NAME,
  entities: [__dirname + '/../databases/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../databases/migrations/**/*{.ts,.js}'],
  subscribers: [__dirname + '/../databases/subscribers/**/*{.ts,.js}'],
  logging: EnvConfig.Const().DEBUG,
  logger: TypeOrmLoggerContainer.ForConnection(EnvConfig.Const().DEBUG ? 'all' : []),
  namingStrategy: new NamingStrategy(),
  ssl: EnvConfig.Const().DATABASE.SSL,
};
