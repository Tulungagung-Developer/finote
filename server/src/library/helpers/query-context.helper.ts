import { BasePaginatedResponseDto } from '@core/dtos/base.dto';
import { TSortQueryFilter } from '@core/interceptors/query-filter.interceptor';
import { RequestContext } from '@core/interceptors/request.interceptor';
import BaseEntity from '@db/entities/base/base';
import { BadRequestException } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';

function getTarget<T extends BaseEntity>(query: SelectQueryBuilder<T>): { entity: any; mainAlias: string } {
  const entity = query.expressionMap.mainAlias?.target as any;
  if (!entity) throw new Error('Entity not found');
  const mainAlias = query.expressionMap.mainAlias?.name || entity.name;
  return { entity, mainAlias };
}

function onQueryFilterSearch<T extends BaseEntity>(query: SelectQueryBuilder<T>, search?: string) {
  if (!search) return;

  const target = getTarget(query);
  const searchable = 'searchable' in target.entity ? target.entity.searchable : [];

  const searchTerm = `%${search}%`;
  const searchConditions = searchable.map((c: string) => `${target.mainAlias}.${c} LIKE :searchTerm`);

  query.andWhere(`(${searchConditions.join(' OR ')})`, { searchTerm });
}

function onQueryFilterSort<T extends BaseEntity>(query: SelectQueryBuilder<T>, sort?: TSortQueryFilter[]) {
  const target = getTarget(query);
  const sortable = 'sortable' in target.entity ? target.entity.sortable : [];

  for (const row of sort || []) {
    if (!sortable.includes(row.property)) continue;
    query.addOrderBy(`${target.mainAlias}.${row.property}`, row.type);
  }
}

function onQueryFilterDateRange<T extends BaseEntity>(query: SelectQueryBuilder<T>, startDate?: Date, endDate?: Date) {
  const target = getTarget(query);
  const dateRange = 'dateRange' in target.entity ? target.entity.dateRange : '';

  if (!dateRange) return;

  if (startDate) {
    query.andWhere(`${target.mainAlias}.${dateRange} >= :startDate`, { startDate });
  }

  if (endDate) {
    query.andWhere(`${target.mainAlias}.${dateRange} <= :endDate`, { endDate });
  }
}

export async function CreateResponseByContext<T extends BaseEntity>(
  context: RequestContext,
  query: SelectQueryBuilder<T>,
): Promise<BasePaginatedResponseDto<T>> {
  if (!context.paged) throw new BadRequestException('Paged context is required');

  onQueryFilterSearch(query, context.filter?.search);
  onQueryFilterSort(query, context.filter?.sort);
  onQueryFilterDateRange(query, context.filter?.start_date, context.filter?.end_date);

  const totalData = await query.getCount();
  const items = await query.skip((context.paged?.page_size || 25) * (context.paged?.page || 1) - 1).getMany();

  const response = new BasePaginatedResponseDto<T>();

  response.items = items;
  response.meta = {
    page: context.paged?.page || 1,
    page_size: context.paged?.page_size || 25,
    total_data: totalData,
  };

  return response;
}
