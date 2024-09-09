import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { FastifyRequest as FRequest } from 'fastify';
import { Observable } from 'rxjs';
import { QueryFilter } from '@core/interceptors/query-filter.interceptor';
import { QueryPaged } from '@core/interceptors/query-page.interceptor';

export type RequestContext = { paged?: QueryPaged; filter?: QueryFilter };
export type FastifyRequest = FRequest & { requestContext: RequestContext };

@Injectable()
export class RequestInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
    return next.handle();
  }
}
