import { Crypt } from '@libs/helpers/crypt.helper';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@db/entities/core/user.entity';
import { UserLoginReqDto } from '@core/dtos/user.dto';
import { UserSession } from '@db/entities/core/user-session.entity';

@Injectable()
export class UserService {
  constructor(private readonly jwt: JwtService) {}

  async attempt(dto: UserLoginReqDto): Promise<User> {
    const user = await User.findOneOrFail({ where: { username: dto.username } });

    const isValid = Crypt.compare(dto.password, user.password);
    if (!isValid) throw new UnauthorizedException();

    return user;
  }

  async createSession(user: User, dto: UserLoginReqDto): Promise<UserSession> {
    const blockedSessions = await UserSession.count({ where: { user_id: user.id, is_blocked: true } });
    if (blockedSessions >= 5) {
      throw new UnauthorizedException();
    }

    let userSession = await UserSession.findOne({
      where: { user_id: user.id, user_agent: dto.user_agent, ip_address: dto.ip_address },
    });

    if (!userSession) {
      const newSession = new UserSession();
      newSession.user_id = user.id;
      newSession.user_agent = dto.user_agent;
      newSession.ip_address = dto.ip_address;
      newSession.is_verified = false;

      await newSession.save();
      userSession = newSession;
    }

    if (userSession.is_verified) {
      if (!userSession.token || userSession.expires_at < new Date()) {
        userSession.token = this.jwt.sign({ sub: user.id });
        userSession.expires_at = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3);
      }

      userSession.last_login = new Date();
      userSession.login_attempts = 0;
      await userSession.save();
    } else {
      if (userSession.login_attempts >= 5) {
        userSession.is_blocked = true;
        await userSession.save();

        throw new UnauthorizedException();
      }

      userSession.login_attempts = (userSession.login_attempts || 0) + 1;
    }

    if (!userSession.is_verified) {
      user.generateOTP();
      await user.save();
    }

    return userSession;
  }

  async verifySession(id: string, code: string): Promise<void> {
    const session = await UserSession.findOne({ where: { id } });
    if (!session) throw new UnauthorizedException();

    const user = await User.findOne({ where: { id: session.user_id } });
    if (!user) throw new UnauthorizedException();

    if (user.otp !== code) throw new UnauthorizedException();
    if (!user.otp_expires_at || user.otp_expires_at < new Date()) throw new UnauthorizedException();

    user.otp = null;
    user.otp_expires_at = null;
    await user.save();

    session.token = this.jwt.sign({ sub: session.user_id });
    session.expires_at = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3);
    session.login_attempts = 0;
    session.is_verified = true;
    await session.save();
  }
}
