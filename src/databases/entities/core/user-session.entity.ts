import * as crypto from 'crypto';
import BaseEntity from '@db/entities/base/base';
import {
  BooleanColumn,
  DateTimeColumn,
  ForeignColumn,
  NumberColumn,
  StringColumn,
} from '@libs/typeorm/column-decorator.typeorm';
import { CoreEntity } from '@db/entities/base/core';
import { EntityManager, Index, ManyToOne, Not } from 'typeorm';
import { Exclude, Type } from 'class-transformer';
import { User } from '@db/entities/core/user.entity';
import { time } from '@libs/helpers/time.helper';
import { DataConnenctor } from '@libs/typeorm/data-connector.typeorm';
import { JwtService } from '@nestjs/jwt';

export enum UserSessionValidity {
  SAFE_LOGIN = 'safe_login',
  RECREATE_ACCESS_TOKEN = 'recreate_access_token',
  NEED_VALIDATION = 'need_validation',
  ATTEMPT_VERIFICATION = 'attempt_verification',
  BLOCKED = 'blocked',
}

@CoreEntity()
export class UserSession extends BaseEntity {
  @Exclude()
  @ForeignColumn({ nullable: false })
  user_id: string;

  @Exclude()
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Exclude()
  @Index()
  @StringColumn({ nullable: true })
  refresh_token: string | null;

  @Exclude()
  @DateTimeColumn({ nullable: true })
  refresh_token_expires_at: time.Dayjs | null;

  @Exclude()
  @StringColumn({ nullable: false })
  user_agent: string;

  @Exclude()
  @StringColumn({ nullable: false })
  ip_address: string;

  @Exclude()
  @BooleanColumn({ default: false })
  is_blocked: boolean;

  @Exclude()
  @NumberColumn({ default: 0 })
  attempt: number;

  @Index()
  @StringColumn({ nullable: true })
  access_token: string | null;

  @DateTimeColumn({ nullable: true })
  @Type(() => Date)
  access_token_expires_at: time.Dayjs | null;

  @BooleanColumn({ default: false })
  is_verified: boolean;

  @DateTimeColumn({ nullable: true })
  @Type(() => Date)
  last_login: time.Dayjs;

  async rotateRefreshToken(manager?: EntityManager) {
    await DataConnenctor(async (em: EntityManager) => {
      this.refresh_token = `fnt_${crypto.randomBytes(32).toString('hex')}`;
      this.refresh_token_expires_at = time().add(30, 'days');

      const isExists = await em
        .getRepository(UserSession)
        .exists({ where: { refresh_token: this.refresh_token, id: Not(this.id) } });

      if (isExists) await this.rotateRefreshToken(em);
    }, manager);
  }

  async rotateAccessToken(jwtService: JwtService) {
    this.access_token = await jwtService.signAsync(
      {
        sub: this.user_id,
      },
      { secret: this.refresh_token as string, expiresIn: '1h' },
    );
    this.access_token_expires_at = time().add(1, 'hour');
  }

  get validity() {
    const isRefreshTokenValid =
      this.refresh_token && this.refresh_token_expires_at && time().isBefore(this.refresh_token_expires_at);
    const isAccessTokenValid =
      this.access_token && this.access_token_expires_at && time().isBefore(this.access_token_expires_at);
    const isAttemptValid = (this.attempt || 0) < 5;

    if (this.is_blocked) return UserSessionValidity.BLOCKED;

    if (isAttemptValid && this.is_verified && isRefreshTokenValid && isAccessTokenValid) {
      return UserSessionValidity.SAFE_LOGIN;
    } else if (isAttemptValid && this.is_verified && isRefreshTokenValid && isAttemptValid) {
      return UserSessionValidity.RECREATE_ACCESS_TOKEN;
    } else if (isAttemptValid && this.is_verified) {
      return UserSessionValidity.NEED_VALIDATION;
    } else if (isAttemptValid) {
      return UserSessionValidity.ATTEMPT_VERIFICATION;
    }
  }
}
