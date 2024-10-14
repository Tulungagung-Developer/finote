import { AccountCreateReqDto, AccountUpdateReqDto } from '@core/dtos/account.dto';
import { BasePaginatedResponseDto } from '@core/dtos/base.dto';
import { RequestContext } from '@core/interceptors/request.interceptor';
import { AccountHistory, AccountHistoryAction } from '@db/entities/core/account-history.entity';
import { Account } from '@db/entities/core/account.entity';
import { User } from '@db/entities/core/user.entity';
import { DecimalNumber } from '@libs/helpers/decimal.helper';
import { CreateResponseByContext } from '@libs/helpers/query-context.helper';
import { Retry } from '@libs/helpers/retry.helper';
import { DataConnector } from '@libs/typeorm/data-connector.typeorm';
import { DataSource } from '@libs/typeorm/datasource.typeorm';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, Not, OptimisticLockVersionMismatchError } from 'typeorm';

@Injectable()
export class AccountService {
  async getAccounts(ctx: RequestContext, user: User): Promise<BasePaginatedResponseDto<Account>> {
    if (!ctx.paged) throw new BadRequestException('Pagination context is required');

    type TAccount = Account & { sortable: string[]; searchable: string[]; dateRange: string };

    const query = DataSource.createQueryBuilder<TAccount>(Account, Account.name);
    query.where(`${Account.name}.user_id = :user_id`, { user_id: user.id });

    return CreateResponseByContext<TAccount>(ctx, query);
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

    return CreateResponseByContext<AccountHistory>(ctx, query);
  }

  async createAccount(dto: AccountCreateReqDto, user: User): Promise<Account> {
    return DataConnector(async (connector: EntityManager) => {
      const existingAccount = await connector.getRepository(Account).findOne({
        where: [
          { user_id: user.id, name: dto.name },
          { user_id: user.id, reference: dto.reference },
        ],
      });

      if (existingAccount) {
        throw new BadRequestException(
          `${existingAccount.name === dto.name ? 'An account with this name already exists' : 'An account with this reference alread exists'}`,
        );
      }

      const account = new Account();
      account.user_id = user.id;
      account.name = dto.name;
      account.reference = dto.reference;
      account.balance = new DecimalNumber(dto.initial_balance);
      account.minimum_balance = new DecimalNumber(dto.minimum_balance);
      account.type = dto.type;
      account.currency = dto.currency;

      await connector.getRepository(Account).save(account, { reload: true });

      const log = new AccountHistory();
      log.account_id = account.id;
      log.action = AccountHistoryAction.OTHER;
      log.description = `Initially account: ${account.name}${account.reference ? ` - ${account.reference}` : ''}`;
      log.pre_balance = new DecimalNumber(0);
      log.post_balance = account.balance;

      await connector.getRepository(AccountHistory).save(log);

      return account;
    });
  }

  async updateAccount(dto: AccountUpdateReqDto, user: User): Promise<Account> {
    const fn = async (param: AccountUpdateReqDto, connector: EntityManager) => {
      const account = await connector.getRepository(Account).findOne({
        where: { user_id: user.id, id: param.account_id },
      });

      if (!account) throw new NotFoundException();

      const existingAccount = await connector
        .getRepository(Account)
        .findOne({ where: [{ name: param.name }, { reference: param.reference }, { id: Not(account.id) }] });

      if (existingAccount) {
        throw new BadRequestException(
          `${existingAccount.name === param.name ? 'An account with this name already exists' : 'An account with this reference alread exists'}`,
        );
      }

      const pre_balance = account.balance;

      account.name = param.name ?? account.name;
      account.reference = param.reference ?? account.reference;
      account.minimum_balance = !param.minimum_balance
        ? new DecimalNumber(account.minimum_balance)
        : new DecimalNumber(param.minimum_balance);

      if (account.minimum_balance.gte(account.balance)) {
        throw new BadRequestException('Minimum balance cannot be greater than or equal to the current balance');
      }

      await connector
        .getRepository(Account)
        .findOne({ where: { id: account.id }, lock: { mode: 'optimistic', version: account.version++ } });

      await connector.getRepository(Account).save(account, { reload: true });

      const log = new AccountHistory();
      log.account_id = account.id;
      log.action = AccountHistoryAction.OTHER;
      log.description = `Update account detail`;
      log.pre_balance = pre_balance;
      log.post_balance = account.balance;

      await connector.getRepository(AccountHistory).save(log);

      return account;
    };

    return Retry.create<AccountUpdateReqDto, Account>(async (param) => DataConnector(async (dc) => fn(param, dc)))
      .configure({ maxAttempts: Infinity, delay: 2000 })
      .catch(OptimisticLockVersionMismatchError)
      .execute(dto);
  }
}
