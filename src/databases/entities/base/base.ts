import { uuid } from '@libs/uid/uuid.library';
import { BaseEntity as Base, BeforeInsert, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { instanceToPlain } from 'class-transformer';

export default class BaseEntity extends Base {
  @Column({ type: 'varchar', primary: true })
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  updateDatabase() {
    if (!this.id) this.id = uuid();
  }

  toJSON(): Record<string, any> {
    return instanceToPlain(this, { excludePrefixes: ['__'] });
  }
}
