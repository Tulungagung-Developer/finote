import { CoreEntity } from '@db/entities/base/core';
import BaseEntity from '@db/entities/base/base';
import { StringColumn } from '@libs/typeorm/column-decorator.typeorm';
import { Index } from 'typeorm';

@CoreEntity()
export class Note extends BaseEntity {
  @Index()
  @StringColumn({ nullable: false })
  name: string;

  @StringColumn({ nullable: true, length: 100 })
  description: string | null;
}
