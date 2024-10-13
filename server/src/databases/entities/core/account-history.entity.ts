import { CoreEntity } from '@db/entities/base/core';
import BaseEntity from '@db/entities/base/base';
import { AmmountColumn, ForeignColumn, StringColumn } from '@libs/typeorm/column-decorator.typeorm';
import { ManyToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Account } from '@db/entities/core/account.entity';

@CoreEntity()
export class AccountHistory extends BaseEntity {
  @Exclude()
  @ForeignColumn()
  account_id: string;

  @ManyToOne(() => Account, { onDelete: 'CASCADE' })
  account: Account;

  @StringColumn({ nullable: false })
  action: string;

  @AmmountColumn({ nullable: false })
  pre_balance: number;

  @AmmountColumn({ nullable: false })
  post_balance: number;
}
