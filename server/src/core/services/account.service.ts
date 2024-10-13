import { AccountCreateReqDto, AccountUpdateReqDto } from '@core/dtos/account.dto';
import { BasePaginatedResponseDto } from '@core/dtos/base.dto';
import { RequestContext } from '@core/interceptors/request.interceptor';
import { AccountHistory, AccountHistoryAction } from '@db/entities/core/account-history.entity';
import { Account } from '@db/entities/core/account.entity';
import { User } from '@db/entities/core/user.entity';
import { DataConnector } from '@libs/typeorm/data-connector.typeorm';
import { DataSource } from '@libs/typeorm/datasource.typeorm';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class AccountService {
  private logger = new Logger(AccountService.name);

  constructor() {}

  async getAccounts(ctx: RequestContext, user: User): Promise<BasePaginatedResponseDto<Account>> {
    if (!ctx.paged) throw new BadRequestException('Pagination context is required');

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

  async getHistories(
    ctx: RequestContext,
    user: User,
    account_id: string,
  ): Promise<BasePaginatedResponseDto<AccountHistory>> {
    if (!ctx.paged) throw new BadRequestException('Pagination context is required');

    const query = DataSource.createQueryBuilder(AccountHistory, AccountHistory.name);
    query.leftJoin(Account, 't2', `${AccountHistory.name}.account_id = t2.id`);
    query.where('t2.user_id = :user_id', { user_id: user.id });
    query.andWhere(`${AccountHistory.name}.account_id = :account_id`, { account_id });

    const result = await AccountHistory.onQueryContext(query, AccountHistory.name, ctx);
    const response = new BasePaginatedResponseDto<AccountHistory>();

    response.items = result.items;
    response.meta = {
      page: ctx.paged.page,
      page_size: ctx.paged.page_size,
      total_data: result.totalData,
    };

    return response;
  }

  async createAccount(dto: AccountCreateReqDto, user: User): Promise<Account> {
    return DataConnector(async (connector: EntityManager) => {
      const existingAccount = await connector.getRepository(Account).findOne({
        where: [
          { user_id: user.id, name: dto.name },
          { user_id: user.id, reference: dto.reference },
        ],
      });

      if (existingAccount) throw new BadRequestException('Account already exists');

      const account = new Account();
      account.user_id = user.id;
      account.name = dto.name;
      account.reference = dto.reference;
      account.balance = dto.initial_balance;
      account.minimum_balance = dto.minimum_balance;
      account.type = dto.type;
      account.currency = dto.currency;

      await connector.getRepository(Account).save(account, { reload: true });

      const log = new AccountHistory();
      log.account_id = account.id;
      log.action = AccountHistoryAction.OTHER;
      log.description = `Initially account: "${account.name}"${account.reference ? ` - ${account.reference}` : ''}`;
      log.pre_balance = 0;
      log.post_balance = account.balance;

      await connector.getRepository(AccountHistory).save(log);

      return account;
    });
  }

  async updateAccount(dto: AccountUpdateReqDto, user: User): Promise<Account> {
    return DataConnector(async (connector: EntityManager) => {
      const account = await connector.getRepository(Account).findOne({
        where: { user_id: user.id, id: dto.account_id },
      });

      if (!account) throw new NotFoundException();
      const pre_balance = account.balance;

      if (Number(dto.minimum_balance) >= 0 && Number(dto.minimum_balance) > account.balance) {
        throw new BadRequestException('Can not set minimum balance more than account balance');
      }

      account.name = !dto.name ? account.name : dto.name;
      account.reference = !dto.reference ? account.reference : dto.reference;
      account.minimum_balance = !dto.minimum_balance ? account.minimum_balance : dto.minimum_balance;

      await connector.getRepository(Account).save(account, { reload: true });

      const log = new AccountHistory();
      log.account_id = account.id;
      log.action = AccountHistoryAction.OTHER;
      log.description = `Update account detail`;
      log.pre_balance = pre_balance;
      log.post_balance = account.balance;

      await connector.getRepository(AccountHistory).save(log);

      return account;
    });
  }
}
