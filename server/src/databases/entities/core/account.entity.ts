import { CoreEntity } from '@db/entities/base/core';
import BaseEntity from '@db/entities/base/base';
import { AmountColumn, ForeignColumn, StringColumn } from '@libs/typeorm/column-decorator.typeorm';
import { Check, Index, ManyToOne, VersionColumn } from 'typeorm';
import { Exclude, Transform } from 'class-transformer';
import { User } from '@db/entities/core/user.entity';
import { Currencies } from '@db/constants/currencies.const';
import { DecimalNumber } from '@libs/helpers/decimal.helper';

export enum AccountType {
  CASH = 'cash',
  DEBIT_CARD = 'debit_card',
  EWALLET = 'ewallet',
}

@Check('"balance" >= "minimum_balance"')
@CoreEntity()
export class Account extends BaseEntity {
  static readonly searchable: (keyof Account)[] = ['name', 'reference'];
  static readonly sortable: (keyof Account)[] = ['name', 'balance', 'type', 'currency', 'created_at'];
  static readonly dateRange: keyof Account = 'created_at';

  @Exclude()
  @ForeignColumn()
  user_id: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  user: User;

  @StringColumn({ enum: AccountType, nullable: false })
  type: AccountType;

  @StringColumn({ enum: Currencies })
  currency: Currencies;

  @Index()
  @StringColumn({ nullable: false, length: 100 })
  name: string;

  @StringColumn({ nullable: true, length: 50 })
  reference: string;

  @Transform(({ value }) => value.toFixed(2))
  @AmountColumn()
  balance: DecimalNumber;

  @Transform(({ value }) => value.toFixed(2))
  @AmountColumn()
  minimum_balance: DecimalNumber;

  @Exclude()
  @VersionColumn()
  version: number;
}
