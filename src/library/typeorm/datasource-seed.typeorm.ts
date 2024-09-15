import '@conf/__boot';
import { EnvConfig } from '@conf/env.config';

import { DataSource as DataTypeORM } from 'typeorm';
import { TypeOrmLoggerContainer } from '@libs/typeorm/logger.typeorm';
import { NamingStrategy } from '@libs/typeorm/naming.typeorm';

class MakeDataSource {
  private static _instance: MakeDataSource;
  private _datasource: DataTypeORM;

  constructor() {
    if (!MakeDataSource._instance) this.init().catch(console.error);
  }

  async init() {
    this._datasource = new DataTypeORM({
      type: 'postgres',
      host: EnvConfig.Const().DATABASE.HOST,
      port: EnvConfig.Const().DATABASE.PORT,
      username: EnvConfig.Const().DATABASE.USERNAME,
      password: EnvConfig.Const().DATABASE.PASSWORD,
      database: EnvConfig.Const().DATABASE.NAME,
      migrations: [__dirname + '/../../databases/seeds/**/*{.ts,.js}'],
      logging: EnvConfig.Const().DEBUG,
      logger: TypeOrmLoggerContainer.ForConnection(EnvConfig.Const().DEBUG ? 'all' : []),
      namingStrategy: new NamingStrategy(),
    });
    if (!this._datasource.isInitialized) {
      await this._datasource.initialize();
    }
  }

  static get instance() {
    const instance = this._instance || (this._instance = new this());
    return instance._datasource;
  }
}

export const DataSourceSeeds = MakeDataSource.instance;
