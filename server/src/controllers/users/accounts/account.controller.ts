import { Me } from '@core/decorators/me.decorator';
import { ReqContext } from '@core/decorators/request-context.decorator';
import { AccountCreateReqDto, AccountUpdateReqDto } from '@core/dtos/account.dto';
import { RequestContext } from '@core/interceptors/request.interceptor';
import { AccountService } from '@core/services/account.service';
import { AbstractController } from '@ctrl/abstract.controller';
import { User } from '@db/entities/core/user.entity';
import { plainToInstance } from '@libs/class-transformer/from-plain.transformer';
import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller()
export class AccountController extends AbstractController {
  constructor(private readonly accountService: AccountService) {
    super();
  }

  @Get()
  async index(@ReqContext() ctx: RequestContext, @Me() user: User) {
    return this.accountService.getAccounts(ctx, user);
  }

  @Post()
  async create(@Body() body: Record<string, any>, @Me() user: User) {
    const dto = await plainToInstance(AccountCreateReqDto, body);
    return this.accountService.createAccount(dto, user);
  }

  @Put('/:account_id')
  async update(@Param() param: Record<string, any>, @Body() body: Record<string, any>, @Me() user: User) {
    const dto = await plainToInstance(AccountUpdateReqDto, { ...param, ...body });
    return this.accountService.updateAccount(dto, user);
  }

  @Get('/:account_id/histories')
  async getHistories(@ReqContext() ctx: RequestContext, @Param() param: Record<string, any>, @Me() user: User) {
    return this.accountService.getHistories(ctx, user, param.account_id);
  }
}
