import { DataSource as DataTypeORM } from 'typeorm';
import { DatabaseConfig } from '@conf/database.config';
import * as console from 'node:console';

export class MakeDataSource {
  private static _instance: MakeDataSource;
  private _datasource: DataTypeORM;

  constructor() {
    if (!MakeDataSource._instance) this.init().catch(console.error);
  }

  async init() {
    this._datasource = new DataTypeORM(DatabaseConfig);
    if (!this._datasource.isInitialized) {
      await this._datasource.initialize();
    }
  }

  static get instance() {
    const instance = this._instance || (this._instance = new this());
    return instance._datasource;
  }
}

export const DataSource = MakeDataSource.instance;
