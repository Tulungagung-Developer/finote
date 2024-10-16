import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AbstractController } from '@ctrl/abstract.controller';
import { UserLoginReqDto, UserSessionVerifyReqDto } from '@core/dtos/user.dto';
import { UserService } from '@core/services/user.service';
import { FastifyRequest } from '@core/interceptors/request.interceptor';
import { UserSession } from '@db/entities/core/user-session.entity';
import { FastifyReply } from 'fastify';
import { Me } from '@core/decorators/me.decorator';
import { User } from '@db/entities/core/user.entity';
import { time } from '@libs/helpers/time.helper';
import { DataConnector } from '@libs/typeorm/data-connector.typeorm';
import { plainToInstance } from '@libs/class-transformer/from-plain.transformer';
import { FasitfyCookieSigner } from '@conf/fastify.config';

@Controller()
export class AuthController extends AbstractController {
  constructor(private readonly service: UserService) {
    super();
  }

  @Post('login')
  async login(
    @Req() request: FastifyRequest,
    @Body() body: Record<string, any>,
    @Res({ passthrough: true }) response: FastifyReply,
  ): Promise<UserSession> {
    const payload = {
      user_agent: request.headers['user-agent'],
      ip_address: request.ip,
      email: body.email || '',
      username: body.username || '',
      password: body.password || '',
    };

    const dto = await plainToInstance(UserLoginReqDto, payload);

    const userSession = await DataConnector(async (connector) => {
      const user = await this.service.attempt(dto, connector);
      return this.service.createSession(user, dto, connector);
    });

    if (userSession.is_verified) {
      response.setCookie('refresh_token', userSession.refresh_token as string, {
        signed: true,
        expires: (userSession.refresh_token_expires_at as time.Dayjs).toDate(),
        path: '/auth',
      });
    }

    return userSession;
  }

  @Get('logout')
  async logout(@Req() request: FastifyRequest, @Me() user: User) {
    const token = request.headers.authorization?.replace('Bearer ', '');
    if (!token) throw new BadRequestException();

    await this.service.logoutSession(token, user);
  }

  @Get('verify')
  async verifySession(@Query() query: UserSessionVerifyReqDto) {
    await DataConnector(async (connector) => this.service.verifySession(query, connector));
  }

  @Get('refresh')
  async refreshSession(@Req() request: FastifyRequest) {
    const refresh_token = request.cookies['refresh_token'];
    if (!refresh_token) throw new UnauthorizedException();

    const unsign = FasitfyCookieSigner.unsign(refresh_token);
    if (!unsign.valid) throw new UnauthorizedException();

    return await DataConnector(async (connector) => this.service.refreshSession(unsign.value, connector));
  }
}
