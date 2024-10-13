import { CoreEntity } from '@db/entities/base/core';
import BaseEntity from '@db/entities/base/base';
import { AmountColumn, ForeignColumn, StringColumn } from '@libs/typeorm/column-decorator.typeorm';
import { Index, ManyToOne, SelectQueryBuilder, VersionColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { User } from '@db/entities/core/user.entity';
import { Currencies } from '@db/constants/currencies.const';
import { TSortQueryFilter } from '@core/interceptors/query-filter.interceptor';
import { RequestContext } from '@core/interceptors/request.interceptor';

export enum AccountType {
  CASH = 'cash',
  DEBIT_CARD = 'debit_card',
  EWALLET = 'ewallet',
}

@CoreEntity()
export class Account extends BaseEntity {
  @Exclude()
  @ForeignColumn()
  user_id: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  user: User;

  @StringColumn({ enum: AccountType, nullable: false })
  type: AccountType;

  @StringColumn({ enum: Currencies })
  currency: Currencies;

  @Index()
  @StringColumn({ nullable: false, length: 100 })
  name: string;

  @StringColumn({ nullable: true, length: 50 })
  reference: string;

  @AmountColumn()
  balance: number;

  @AmountColumn()
  minimum_balance: number;

  @VersionColumn()
  version: number;

  static readonly searchable: (keyof Account)[] = ['name', 'reference'];
  static readonly sortable: (keyof Account)[] = ['name', 'balance', 'type', 'currency', 'created_at'];
  static readonly dateRange: keyof Account = 'created_at';

  private static onQueryFilterSort(query: SelectQueryBuilder<Account>, mainAlias: string, sort?: TSortQueryFilter[]) {
    for (const row of sort || []) {
      if (Account.sortable.includes(row.property as keyof Account)) {
        query.addOrderBy(`${mainAlias}.${row.property}`, row.type);
      }
    }
  }

  private static onQueryFilterSearch(query: SelectQueryBuilder<Account>, mainAlias: string, search?: string) {
    if (!search) return;

    const searchTerm = `%${search}%`;
    const searchConditions = Account.searchable.map((c) => `${mainAlias}.${c} LIKE :searchTerm`);

    if (query.getQuery().includes('WHERE')) {
      query.andWhere(`(${searchConditions.join(' OR ')})`, { searchTerm });
      return;
    }

    query.where(`(${searchConditions.join(' OR ')})`, { searchTerm });
  }

  private static onQueryFilterDateRange(
    query: SelectQueryBuilder<Account>,
    mainAlias: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    const hasWhere = query.getQuery().includes('WHERE');

    if (startDate && !hasWhere) {
      query.where(`${mainAlias}.${Account.dateRange} >= :startDate`, { startDate: startDate });
    }

    if (startDate && hasWhere) {
      query.andWhere(`${mainAlias}.${Account.dateRange} >= :startDate`, { startDate: startDate });
    }

    if (endDate && !hasWhere) {
      query.where(`${mainAlias}.${Account.dateRange} <= :endDate`, { endDate: endDate });
    }

    if (endDate && hasWhere) {
      query.andWhere(`${mainAlias}.${Account.dateRange} <= :endDate`, { endDate: endDate });
    }
  }

  static async onQueryContext(
    query: SelectQueryBuilder<Account>,
    mainAlias: string,
    context: RequestContext,
  ): Promise<{ totalData: number; items: Account[] }> {
    Account.onQueryFilterSearch(query, mainAlias, context.filter?.search);
    Account.onQueryFilterSort(query, mainAlias, context.filter?.sort);
    Account.onQueryFilterDateRange(query, mainAlias, context.filter?.start_date, context.filter?.end_date);

    const totalData = await query.getCount();

    if (context.paged) {
      query.limit(context.paged.page_size);
      query.skip(context.paged.page_size * (Math.max(context.paged.page, 1) - 1));
    }

    const items = await query.getMany();
    return { totalData, items };
  }
}
