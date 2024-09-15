import BaseEntity from '@db/entities/base/base';
import { CoreEntity } from '@db/entities/base/core';
import { ManyToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
import { User } from '@db/entities/core/user.entity';
import {
  BooleanColumn,
  DateTimeColumn,
  ForeignColumn,
  NumberColumn,
  StringColumn,
} from '@libs/typeorm/column-decorator.typeorm';

@CoreEntity()
export class UserSession extends BaseEntity {
  @StringColumn({ nullable: true })
  token: string;

  @DateTimeColumn({ nullable: true })
  expires_at: Date;

  @StringColumn()
  user_agent: string;

  @StringColumn()
  ip_address: string;

  @DateTimeColumn({ nullable: true })
  last_login: Date;

  @NumberColumn({ default: 0 })
  login_attempts: number;

  @BooleanColumn({ default: false })
  is_blocked: boolean;

  @BooleanColumn({ default: false })
  is_verified: boolean;

  @Exclude()
  @ForeignColumn({ nullable: false })
  user_id: string;

  @Exclude()
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;
}
