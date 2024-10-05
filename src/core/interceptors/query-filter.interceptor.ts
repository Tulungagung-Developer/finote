import * as url from 'node:url';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import {
  IsDate,
  IsOptional,
  Validate,
  ValidateIf,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Observable } from 'rxjs';
import { Transform } from 'class-transformer';
import { plainToInstance } from '@libs/class-transformer/from-plain.transformer';

@ValidatorConstraint({ name: 'isSortUnique', async: false })
class IsSortUnique implements ValidatorConstraintInterface {
  validate(value: { property: string; type: 'asc' | 'desc' }[]): boolean {
    return new Set(value.map((v) => v.property)).size === value.length;
  }

  defaultMessage() {
    return 'Sort property must be unique';
  }
}

export class QueryFilter {
  @IsOptional()
  search: string;

  @IsOptional()
  @Transform(({ value }) =>
    value
      ? value
          .split(',')
          .map((v: string) =>
            v.startsWith('-') ? { property: v.slice(1), type: 'desc' } : { property: v, type: 'asc' },
          )
      : undefined,
  )
  @Validate(IsSortUnique)
  sort: { property: string; type: 'asc' | 'desc' }[];

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  @ValidateIf((_, value) => value !== undefined)
  start_date: Date;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  @ValidateIf((_, value) => value !== undefined)
  end_date: Date;
}

@Injectable()
export class QueryFilterInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const requestContext = { ...(req.requestContext || {}) };

    const parse = url.parse(req.url, true);
    const queries = JSON.parse(JSON.stringify(parse.query));

    if ('search' in queries || 'sort' in queries || 'start_date' in queries || 'end_date' in queries) {
      const queryFilter = await plainToInstance(QueryFilter, {
        search: queries.search,
        sort: queries.sort,
        start_date: queries.start_date,
        end_date: queries.end_date,
      });

      requestContext.filter = queryFilter;
    }

    req.requestContext = requestContext;
    return next.handle();
  }
}
