import BaseEntity from '@db/entities/base/base';
import { CoreEntity } from '@db/entities/base/core';
import { ForeignColumn } from '@libs/typeorm/column-decorator.typeorm';
import { ManyToOne } from 'typeorm';
import { Note } from '@db/entities/core/note.entity';
import { User } from '@db/entities/core/user.entity';

@CoreEntity()
export class NoteMember extends BaseEntity {
  @ForeignColumn()
  note_id: string;

  @ManyToOne(() => Note, { onDelete: 'CASCADE' })
  note: Note;

  @ForeignColumn()
  user_id: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  user: User;
}
