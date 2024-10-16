import { CoreEntity } from '@db/entities/base/core';
import BaseEntity from '@db/entities/base/base';
import { AmountColumn, ForeignColumn, StringColumn } from '@libs/typeorm/column-decorator.typeorm';
import { Index, ManyToOne } from 'typeorm';
import { Exclude, Transform } from 'class-transformer';
import { Account } from '@db/entities/core/account.entity';
import Decimal from 'decimal.js';

export enum AccountHistoryAction {
  OTHER = 'OTHER',
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

@CoreEntity()
export class AccountHistory extends BaseEntity {
  static readonly searchable: (keyof AccountHistory)[] = ['action', 'description'];
  static readonly sortable: (keyof AccountHistory)[] = ['action', 'pre_balance', 'post_balance', 'created_at'];
  static readonly dateRange: keyof AccountHistory = 'created_at';

  @Exclude()
  @ForeignColumn()
  account_id: string;

  @ManyToOne(() => Account, { onDelete: 'CASCADE' })
  account: Account;

  @Index()
  @StringColumn({ enum: AccountHistoryAction, nullable: false })
  action: AccountHistoryAction;

  @StringColumn({ nullable: false })
  description: string;

  @Transform((v) => v.toString())
  @AmountColumn({ nullable: false })
  pre_balance: Decimal;

  @Transform((v) => v.toString())
  @AmountColumn({ nullable: false })
  post_balance: Decimal;
}
