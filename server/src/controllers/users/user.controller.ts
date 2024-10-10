import { AbstractController } from '@ctrl/abstract.controller';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@db/entities/core/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { Me } from '@core/decorators/me.decorator';

@UseGuards(AuthGuard('jwt'))
@Controller()
export class UserController extends AbstractController {
  @Get()
  async index(@Me() user: User): Promise<User> {
    return user;
  }
}
