import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { AbstractController } from '@ctrl/abstract.controller';
import { UserLoginReqDto } from '@core/dtos/user.dto';
import { UserService } from '@core/services/user.service';
import { FastifyRequest } from '@core/interceptors/request.interceptor';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationException } from '@core/exceptions/validation.exception';
import { UserSession } from '@db/entities/core/user-session.entity';

@Controller()
export class AuthController extends AbstractController {
  constructor(private readonly service: UserService) {
    super();
  }

  @Post('login')
  async login(@Req() request: FastifyRequest, @Body() body: Record<string, any>): Promise<UserSession> {
    const payload = {
      user_agent: request.headers['user-agent'],
      ip_address: request.ip,
      username: body.username || '',
      password: body.password || '',
    };

    const dto = plainToInstance(UserLoginReqDto, payload);
    const errors = await validate(dto);
    if (errors.length) {
      throw new ValidationException(errors);
    }

    const user = await this.service.attempt(dto);
    return this.service.createSession(user, dto);
  }

  @Get('verify/:id')
  async getVerify(@Param() param: { id: string }, @Query() query: { code: string }): Promise<void> {
    const payload = {
      id: param.id,
      code: query.code,
    };

    await this.service.verifySession(payload.id, payload.code);
  }
}
