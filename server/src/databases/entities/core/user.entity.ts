import { CoreEntity } from '@db/entities/base/core';
import BaseEntity from '@db/entities/base/base';
import { EntityManager, Index, Not } from 'typeorm';
import { Exclude } from 'class-transformer';
import { DateTimeColumn, StringColumn } from '@libs/typeorm/column-decorator.typeorm';
import { time } from '@libs/helpers/time.helper';
import { DataConnenctor } from '@libs/typeorm/data-connector.typeorm';

export enum TypeUserOTP {
  SESSION_VERIFICATION = 'session_verification',
}

@CoreEntity()
export class User extends BaseEntity {
  @Index()
  @StringColumn({ unique: true, nullable: false })
  email: string;

  @Index()
  @StringColumn({ unique: true, length: 16, nullable: false })
  username: string;

  @Exclude()
  @StringColumn({ nullable: false })
  password: string;

  @Exclude()
  @StringColumn({ nullable: true })
  otp_type: TypeUserOTP | null;

  @Exclude()
  @StringColumn({ length: 6, nullable: true })
  otp: string | null;

  @Exclude()
  @DateTimeColumn({ nullable: true })
  otp_expires_at: time.Dayjs | null;

  async generateOTP(type: TypeUserOTP, manager?: EntityManager) {
    await DataConnenctor(async (em: EntityManager) => {
      if (this.otp && this.otp_type === type && this.otp_expires_at?.isAfter(time())) return;

      this.otp = Math.floor(100000 + Math.random() * 900000).toString();
      this.otp_expires_at = time().add(10, 'minutes');
      this.otp_type = type;

      const isExists = await em
        .getRepository(User)
        .exists({ where: { otp: this.otp, id: Not(this.id), otp_type: type } });
      if (isExists) return this.generateOTP(type, em);
    }, manager);
  }
}
