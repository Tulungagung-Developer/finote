import BaseEntity from '@db/entities/base/base';
import { CoreEntity } from '@db/entities/base/core';
import { AmountColumn, BooleanColumn, ForeignColumn, StringColumn } from '@libs/typeorm/column-decorator.typeorm';
import { ManyToOne } from 'typeorm';
import { NoteTransaction } from '@db/entities/core/note-transaction.entity';
import { Account } from '@db/entities/core/account.entity';
import { DecimalNumber } from '@libs/helpers/decimal.helper';
import { User } from '@db/entities/core/user.entity';

@CoreEntity()
export class NoteItem extends BaseEntity {
  @ForeignColumn()
  transaction_id: string;

  @ManyToOne(() => NoteTransaction, { onDelete: 'CASCADE' })
  transaction: NoteTransaction;

  @ForeignColumn()
  account_id: string;

  @ManyToOne(() => Account, { onDelete: 'SET NULL' })
  account: Account;

  @ForeignColumn()
  user_id: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  user: User;

  @StringColumn({ nullable: false, length: 100 })
  name: string;

  @AmountColumn({ nullable: false })
  amount: DecimalNumber;

  @BooleanColumn({ nullable: false, default: false })
  is_over_budget: boolean;
}
