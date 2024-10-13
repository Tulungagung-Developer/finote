import { AccountCreateReqDto, AccountUpdateReqDto } from '@core/dtos/account.dto';
import { BasePaginatedResponseDto } from '@core/dtos/base.dto';
import { RequestContext } from '@core/interceptors/request.interceptor';
import { AccountHistory } from '@db/entities/core/account-history.entity';
import { Account } from '@db/entities/core/account.entity';
import { User } from '@db/entities/core/user.entity';
import { DataConnenctor } from '@libs/typeorm/data-connector.typeorm';
import { DataSource } from '@libs/typeorm/datasource.typeorm';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class AccountService {
  private logger = new Logger(AccountService.name);

  constructor() {}

  async getAccounts(ctx: RequestContext, user: User): Promise<BasePaginatedResponseDto<Account>> {
    if (!ctx.paged) throw new BadRequestException('Paged is required');

    const query = DataSource.createQueryBuilder(Account, Account.name);
    query.where(`${Account.name}.user_id = :user_id`, { user_id: user.id });

    const result = await Account.onQueryContext(query, Account.name, ctx);
    const response = new BasePaginatedResponseDto<Account>();

    response.items = result.items;
    response.meta = {
      page: ctx.paged.page,
      page_size: ctx.paged.page_size,
      total_data: result.totalData,
    };

    return response;
  }

  async createAccount(dto: AccountCreateReqDto, user: User): Promise<Account> {
    this.logger.log(dto);
    return DataConnenctor(async (connector: EntityManager) => {
      const isExist = await connector.getRepository(Account).exists({
        where: [
          { user_id: user.id, name: dto.name },
          { user_id: user.id, reference: dto.reference },
        ],
      });

      if (isExist) throw new BadRequestException('Account already exists');

      const account = new Account();
      account.user_id = user.id;
      account.name = dto.name;
      account.reference = dto.reference;
      account.balance = dto.initial_balance;
      account.minimum_balance = dto.minimum_balance;
      account.type = dto.type;
      account.currency = dto.currency;

      await connector.getRepository(Account).save(account, { reload: true });

      this.logger.log(account);

      const log = new AccountHistory();
      log.account_id = account.id;
      log.action = `Initially account: "${account.name}"${account.reference ? ` - ${account.reference}` : ''}`;
      log.pre_balance = 0;
      log.post_balance = account.balance;

      await connector.getRepository(AccountHistory).save(log);

      return account;
    });
  }

  async updateAccount(dto: AccountUpdateReqDto, user: User): Promise<Account> {
    return DataConnenctor(async (connector: EntityManager) => {
      const account = await connector.getRepository(Account).findOne({
        where: { user_id: user.id, id: dto.account_id },
      });

      if (!account) throw new NotFoundException();
      const pre_balance = account.balance;

      account.name = dto.name || account.name;
      account.reference = dto.reference || account.reference;
      account.minimum_balance = dto.minimum_balance || account.minimum_balance;

      await connector.getRepository(Account).save(account, { reload: true });

      const log = new AccountHistory();
      log.account_id = account.id;
      log.action = `Update account detail`;
      log.pre_balance = pre_balance;
      log.post_balance = account.balance;

      await connector.getRepository(AccountHistory).save(log);

      return account;
    });
  }
}
