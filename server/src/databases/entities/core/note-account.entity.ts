import BaseEntity from '@db/entities/base/base';
import { CoreEntity } from '@db/entities/base/core';
import { ForeignColumn } from '@libs/typeorm/column-decorator.typeorm';
import { ManyToOne } from 'typeorm';
import { Note } from '@db/entities/core/note.entity';
import { Account } from '@db/entities/core/account.entity';

@CoreEntity()
export class NoteAccount extends BaseEntity {
  @ForeignColumn()
  note_id: string;

  @ManyToOne(() => Note, { onDelete: 'CASCADE' })
  note: Note;

  @ForeignColumn()
  account_id: string;

  @ManyToOne(() => Account, { onDelete: 'SET NULL' })
  account: Note;
}
