import { CoreEntity } from '@db/entities/base/core';
import BaseEntity from '@db/entities/base/base';
import { AmountColumn, ForeignColumn, StringColumn } from '@libs/typeorm/column-decorator.typeorm';
import { Index, ManyToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Account } from '@db/entities/core/account.entity';
import { SelectQueryBuilder } from 'typeorm';
import { TSortQueryFilter } from '@core/interceptors/query-filter.interceptor';
import { RequestContext } from '@core/interceptors/request.interceptor';

export enum AccountHistoryAction {
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
  TRANSFER = 'TRANSFER',
  RECEIVE = 'RECEIVE',
  REFUND = 'REFUND',
  CANCEL = 'CANCEL',
  ADJUST = 'ADJUST',
  REWARD = 'REWARD',
  BONUS = 'BONUS',
  COMMISSION = 'COMMISSION',
  FEE = 'FEE',
  INTEREST = 'INTEREST',
  DIVIDEND = 'DIVIDEND',
  CASHBACK = 'CASHBACK',
  PAYMENT = 'PAYMENT',
  CHARGE = 'CHARGE',
  PENALTY = 'PENALTY',
  OTHER = 'OTHER',
}

@CoreEntity()
export class AccountHistory extends BaseEntity {
  @Exclude()
  @ForeignColumn()
  account_id: string;

  @ManyToOne(() => Account, { onDelete: 'CASCADE' })
  account: Account;

  @Index()
  @StringColumn({ enum: AccountHistoryAction, nullable: false })
  action: AccountHistoryAction;

  @StringColumn({ nullable: false })
  description: string;

  @AmountColumn({ nullable: false })
  pre_balance: number;

  @AmountColumn({ nullable: false })
  post_balance: number;

  static readonly searchable: (keyof AccountHistory)[] = ['action', 'description'];
  static readonly sortable: (keyof AccountHistory)[] = ['action', 'pre_balance', 'post_balance', 'created_at'];
  static readonly dateRange: keyof AccountHistory = 'created_at';

  private static onQueryFilterSort(
    query: SelectQueryBuilder<AccountHistory>,
    mainAlias: string,
    sort?: TSortQueryFilter[],
  ) {
    for (const row of sort || []) {
      if (AccountHistory.sortable.includes(row.property as keyof AccountHistory)) {
        query.addOrderBy(`${mainAlias}.${row.property}`, row.type);
      }
    }
  }

  private static onQueryFilterSearch(query: SelectQueryBuilder<AccountHistory>, mainAlias: string, search?: string) {
    if (!search) return;

    const searchTerm = `%${search}%`;
    const searchConditions = AccountHistory.searchable.map((c) => `${mainAlias}.${c} LIKE :searchTerm`);

    if (query.getQuery().includes('WHERE')) {
      query.andWhere(`(${searchConditions.join(' OR ')})`, { searchTerm });
      return;
    }

    query.where(`(${searchConditions.join(' OR ')})`, { searchTerm });
  }

  private static onQueryFilterDateRange(
    query: SelectQueryBuilder<AccountHistory>,
    mainAlias: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    const hasWhere = query.getQuery().includes('WHERE');

    if (startDate && !hasWhere) {
      query.where(`${mainAlias}.${AccountHistory.dateRange} >= :startDate`, { startDate: startDate });
    }

    if (startDate && hasWhere) {
      query.andWhere(`${mainAlias}.${AccountHistory.dateRange} >= :startDate`, { startDate: startDate });
    }

    if (endDate && !hasWhere) {
      query.where(`${mainAlias}.${AccountHistory.dateRange} <= :endDate`, { endDate: endDate });
    }

    if (endDate && hasWhere) {
      query.andWhere(`${mainAlias}.${AccountHistory.dateRange} <= :endDate`, { endDate: endDate });
    }
  }

  static async onQueryContext(
    query: SelectQueryBuilder<AccountHistory>,
    mainAlias: string,
    context: RequestContext,
  ): Promise<{ totalData: number; items: AccountHistory[] }> {
    AccountHistory.onQueryFilterSearch(query, mainAlias, context.filter?.search);
    AccountHistory.onQueryFilterSort(query, mainAlias, context.filter?.sort);
    AccountHistory.onQueryFilterDateRange(query, mainAlias, context.filter?.start_date, context.filter?.end_date);

    const totalData = await query.getCount();

    if (context.paged) {
      query.limit(context.paged.page_size);
      query.skip(context.paged.page_size * (Math.max(context.paged.page, 1) - 1));
    }

    const items = await query.getMany();
    return { totalData, items };
  }
}
