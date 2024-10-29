import BaseEntity from '@db/entities/base/base';
import { CoreEntity } from '@db/entities/base/core';
import { AmountColumn, ForeignColumn, StringColumn } from '@libs/typeorm/column-decorator.typeorm';
import { ManyToOne } from 'typeorm';
import { Note } from '@db/entities/core/note.entity';
import { DecimalNumber } from '@libs/helpers/decimal.helper';

@CoreEntity()
export class NoteTransaction extends BaseEntity {
  @ForeignColumn()
  note_id: string;

  @ManyToOne(() => Note, { onDelete: 'CASCADE' })
  note: Note;

  @StringColumn({ nullable: false, length: 100 })
  description: string;

  @AmountColumn({ nullable: false })
  total: DecimalNumber;

  @AmountColumn({ nullable: false })
  pre_balance: DecimalNumber;

  @AmountColumn({ nullable: false })
  post_balance: DecimalNumber;
}
