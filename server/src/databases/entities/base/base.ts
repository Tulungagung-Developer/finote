import { uuid } from '@libs/uid/uuid.library';
import { BaseEntity as Base, BeforeInsert, BeforeUpdate, PrimaryColumn } from 'typeorm';
import { instanceToPlain, Type } from 'class-transformer';
import { DateTimeColumn } from '@libs/typeorm/column-decorator.typeorm';
import { time } from '@libs/helpers/time.helper';

export default class BaseEntity extends Base {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @DateTimeColumn({ default: () => 'CURRENT_TIMESTAMP' })
  @Type(() => Date)
  created_at: time.Dayjs;

  @DateTimeColumn({ default: () => 'CURRENT_TIMESTAMP' })
  @Type(() => Date)
  updated_at: time.Dayjs;

  @BeforeInsert()
  updateDatabase() {
    if (!this.id) this.id = uuid();
  }

  @BeforeUpdate()
  updateTimestamp() {
    this.updated_at = time();
  }

  toJSON(): Record<string, any> {
    return instanceToPlain(this, { excludePrefixes: ['__'] });
  }
}
