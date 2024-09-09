import * as url from 'node:url';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { FastifyRequest } from '@core/interceptors/request.interceptor';
import { IsNumber, IsOptional, Max, Min, validate } from 'class-validator';
import { Observable } from 'rxjs';
import { plainToInstance, Transform } from 'class-transformer';
import { ValidationException } from '@core/exceptions/validation.exception';

export class QueryPaged {
  @IsOptional()
  @IsNumber()
  @Min(25)
  @Max(200)
  @Transform(({ value }) => parseInt(value))
  page_size: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  page: number;
}

@Injectable()
export class QueryPageInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest<FastifyRequest>();
    const requestContext = { ...(req.requestContext || {}) };

    const parse = url.parse(req.url, true);
    const queries = JSON.parse(JSON.stringify(parse.query));

    if ('page_size' in queries || 'page' in queries) {
      const queryPaged = plainToInstance(QueryPaged, {
        page_size: queries.page_size || 25,
        page: queries.page || 1,
      });

      const errors = await validate(queryPaged);
      if (errors.length) {
        throw new ValidationException(errors);
      }

      requestContext.paged = queryPaged;
    }

    req.requestContext = requestContext;
    return next.handle();
  }
}
