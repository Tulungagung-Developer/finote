import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { MoreThan } from 'typeorm';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@db/entities/core/user.entity';
import { UserSession } from '@db/entities/core/user-session.entity';
import { time } from '@libs/helpers/time.helper';

type JwtPayload = {
  sub: string;
  iat: number;
};

@Injectable()
export class GuardService extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: async (_: any, token: string, done: any) => {
        if (!token) return done(new UnauthorizedException(), false);

        const session = await UserSession.findOne({
          where: {
            access_token: token,
            is_blocked: false,
            is_verified: true,
            access_token_expires_at: MoreThan(time()),
            refresh_token_expires_at: MoreThan(time()),
          },
        });

        if (!session) return done(new UnauthorizedException(), false);

        return done(null, session.refresh_token);
      },
    });
  }

  async validate(payload: JwtPayload, done: any) {
    const user = await User.findOne({ where: { id: payload.sub } });
    if (!user) return done(new UnauthorizedException(), false);

    return done(null, user);
  }
}
