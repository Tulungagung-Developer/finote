import { BasePaginatedResponseDto } from '@core/dtos/base.dto';
import { TSortQueryFilter } from '@core/interceptors/query-filter.interceptor';
import { RequestContext } from '@core/interceptors/request.interceptor';
import BaseEntity from '@db/entities/base/base';
import { SelectQueryBuilder } from 'typeorm';

function onQueryFilterSearch<T extends BaseEntity>(query: SelectQueryBuilder<T>, search?: string) {
  if (!search) return;

  const entity = query.expressionMap.mainAlias?.target as any;
  const searchable = 'searchable' in entity ? entity.searchable : [];
  const mainAlias = query.expressionMap.mainAlias?.name || entity.name;

  const searchTerm = `%${search}%`;
  const searchConditions = searchable.map((c: string) => `${mainAlias}.${c} LIKE :searchTerm`);

  query.andWhere(`(${searchConditions.join(' OR ')})`, { searchTerm });
}

function onQueryFilterSort<T extends BaseEntity>(query: SelectQueryBuilder<T>, sort?: TSortQueryFilter[]) {
  const entity = query.expressionMap.mainAlias?.target as any;
  const sortable = 'sortable' in entity ? entity.sortable : [];
  const mainAlias = query.expressionMap.mainAlias?.name || entity.name;

  for (const row of sort || []) {
    if (!sortable.includes(row.property)) continue;
    query.addOrderBy(`${mainAlias}.${row.property}`, row.type);
  }
}

function onQueryFilterDateRange<T extends BaseEntity>(query: SelectQueryBuilder<T>, startDate?: Date, endDate?: Date) {
  const entity = query.expressionMap.mainAlias?.target as any;
  const dateRange = 'dateRange' in entity ? entity.dateRange : '';
  const mainAlias = query.expressionMap.mainAlias?.name || entity.name;

  if (!dateRange) return;

  if (startDate) {
    query.andWhere(`${mainAlias}.${dateRange} >= :startDate`, { startDate });
  }

  if (endDate) {
    query.andWhere(`${mainAlias}.${dateRange} <= :endDate`, { endDate });
  }
}

export async function CreateResponseByContext<T extends BaseEntity>(
  context: RequestContext,
  query: SelectQueryBuilder<T>,
): Promise<BasePaginatedResponseDto<T>> {
  onQueryFilterSearch(query, context.filter?.search);
  onQueryFilterSort(query, context.filter?.sort);
  onQueryFilterDateRange(query, context.filter?.start_date, context.filter?.end_date);

  const response = new BasePaginatedResponseDto<T>();

  response.items = await query.getMany();
  response.meta = {
    page: context.paged?.page || 0,
    page_size: context.paged?.page_size || 0,
    total_data: await query.getCount(),
  };

  return response;
}
