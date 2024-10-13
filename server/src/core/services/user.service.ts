import { Crypt } from '@libs/helpers/crypt.helper';
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeUserOTP, User } from '@db/entities/core/user.entity';
import { UserLoginReqDto, UserSessionVerifyReqDto } from '@core/dtos/user.dto';
import { UserSession, UserSessionValidity } from '@db/entities/core/user-session.entity';
import { EntityManager, FindOptionsWhere, MoreThan } from 'typeorm';
import { time } from '@libs/helpers/time.helper';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UserService {
  constructor(
    private readonly jwt: JwtService,
    private readonly mailer: MailerService,
  ) {}

  async attempt(dto: UserLoginReqDto, manager: EntityManager): Promise<User> {
    if (!dto.username && !dto.email) throw new UnauthorizedException();

    const where: FindOptionsWhere<User> = {};
    if (dto.username) where.username = dto.username;
    if (dto.email) where.email = dto.email;

    const user = await manager.getRepository(User).findOneOrFail({ where, lock: { mode: 'pessimistic_read' } });

    const isValid = Crypt.compare(dto.password, user.password);
    if (!isValid) throw new UnauthorizedException();

    return user;
  }

  async createSession(user: User, dto: UserLoginReqDto, manager: EntityManager): Promise<UserSession> {
    if (!dto.user_agent) throw new UnauthorizedException('Unauthorized type of user agent');

    const sessions = await manager.getRepository(UserSession).find({ where: { user_id: user.id } });

    if (sessions.length && sessions.filter((r) => r.is_blocked).length >= 5) {
      throw new UnauthorizedException();
    }

    let userSession = sessions?.find((r) => r.user_agent === dto.user_agent && r.ip_address === dto.ip_address);

    if (!userSession) {
      userSession = new UserSession();
      userSession.user_id = user.id;
      userSession.user_agent = dto.user_agent;
      userSession.ip_address = dto.ip_address;
      userSession.is_verified = false;
    }

    switch (userSession.validity) {
      case UserSessionValidity.SAFE_LOGIN: {
        userSession.last_login = time();
        userSession.attempt = 0;

        await manager.getRepository(UserSession).save(userSession);

        break;
      }
      case UserSessionValidity.RECREATE_ACCESS_TOKEN: {
        await userSession.rotateAccessToken(this.jwt);
        userSession.last_login = time();
        userSession.attempt = 0;

        await manager.getRepository(UserSession).save(userSession);

        break;
      }
      case UserSessionValidity.NEED_VALIDATION: {
        userSession.access_token = null;
        userSession.access_token_expires_at = null;
        userSession.refresh_token = null;
        userSession.refresh_token_expires_at = null;
        userSession.is_verified = false;

        await user.generateOTP(TypeUserOTP.SESSION_VERIFICATION, manager);

        await manager.getRepository(UserSession).save(userSession);
        await manager.getRepository(User).save(user);

        break;
      }
      case UserSessionValidity.ATTEMPT_VERIFICATION: {
        userSession.attempt = (userSession.attempt || 0) + 1;
        userSession.is_blocked = userSession.attempt >= 5;

        await user.generateOTP(TypeUserOTP.SESSION_VERIFICATION, manager);

        await manager.getRepository(UserSession).save(userSession);
        await manager.getRepository(User).save(user);

        break;
      }
      default:
        throw new UnauthorizedException();
    }

    if (user.otp_type && user.otp && !userSession.is_blocked) {
      void this.mailer.sendMail({
        to: user.email,
        subject: 'OTP Verification',
        text: `Your OTP is ${user.otp}`,
      });
    }

    return userSession;
  }

  async verifySession(dto: UserSessionVerifyReqDto, manager: EntityManager): Promise<void> {
    const session = await manager
      .getRepository(UserSession)
      .findOne({ where: { id: dto.session_id, is_blocked: false }, lock: { mode: 'pessimistic_write_or_fail' } });

    if (!session) throw new NotFoundException();

    const user = await manager.getRepository(User).findOne({
      where: { id: session.user_id, otp: dto.code, otp_expires_at: MoreThan(time().toDate()) },
      lock: { mode: 'pessimistic_write_or_fail' },
    });

    if (!user) throw new NotFoundException();

    user.otp = null;
    user.otp_expires_at = null;

    if (!session.refresh_token || !session.refresh_token_expires_at?.isAfter(time().toDate())) {
      await session.rotateRefreshToken(manager);
    }

    session.is_verified = true;
    session.attempt = 0;

    await manager.getRepository(User).save(user);
    await manager.getRepository(UserSession).save(session);
  }

  async refreshSession(refreshToken: string, manager: EntityManager): Promise<UserSession> {
    const session = await manager.getRepository(UserSession).findOne({
      where: {
        refresh_token: refreshToken,
        is_blocked: false,
        is_verified: true,
      },
      lock: { mode: 'pessimistic_write_or_fail' },
    });

    switch (session?.validity) {
      case UserSessionValidity.SAFE_LOGIN: {
        return session;
      }
      case UserSessionValidity.RECREATE_ACCESS_TOKEN: {
        await session.rotateAccessToken(this.jwt);
        await manager.getRepository(UserSession).save(session);
        break;
      }
      case UserSessionValidity.NEED_VALIDATION: {
        const user = await manager
          .getRepository(User)
          .findOne({ where: { id: session.user_id }, lock: { mode: 'pessimistic_write_or_fail' } });

        if (!user) throw new UnauthorizedException();

        session.access_token = null;
        session.access_token_expires_at = null;
        session.refresh_token = null;
        session.refresh_token_expires_at = null;
        session.is_verified = false;

        await user.generateOTP(TypeUserOTP.SESSION_VERIFICATION, manager);

        await manager.getRepository(UserSession).save(session);
        await manager.getRepository(User).save(user);

        void this.mailer.sendMail({
          to: user.email,
          subject: 'OTP Verification',
          text: `Your OTP is ${user.otp}`,
        });

        break;
      }
      default:
        throw new UnauthorizedException();
    }

    return session;
  }

  async logoutSession(access_token: string, user: User) {
    const session = await UserSession.findOne({
      where: { access_token, user_id: user.id },
      lock: { mode: 'pessimistic_write_or_fail' },
    });

    if (!session) throw new BadRequestException();

    session.access_token = null;
    session.access_token_expires_at = null;
    session.refresh_token = null;
    session.refresh_token_expires_at = null;

    await session.save();
  }
}
