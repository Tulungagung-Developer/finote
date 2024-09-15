import { CoreEntity } from '@db/entities/base/core';
import BaseEntity from '@db/entities/base/base';
import { Index } from 'typeorm';
import { Exclude } from 'class-transformer';
import { DateTimeColumn, StringColumn } from '@libs/typeorm/column-decorator.typeorm';

@CoreEntity()
export class User extends BaseEntity {
  @Index()
  @StringColumn({ unique: true, length: 16, nullable: false })
  username: string;

  @Exclude()
  @StringColumn({ nullable: false })
  password: string;

  @StringColumn({ length: 6, nullable: true })
  otp: string | null;

  @DateTimeColumn({ nullable: true })
  otp_expires_at: Date | null;

  generateOTP() {
    // Generate 6 digit OTP
    this.otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.otp_expires_at = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  }
}
