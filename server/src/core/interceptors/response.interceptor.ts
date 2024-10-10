import { BasePaginatedResponseDto, BaseResponseDto } from '@core/dtos/base.dto';
import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { instanceToPlain } from 'class-transformer';
import { map, Observable } from 'rxjs';
import BaseEntity from '@db/entities/base/base';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const req = context.switchToHttp().getRequest<FastifyRequest>();
    const res = context.switchToHttp().getResponse<FastifyReply>();

    res.status(HttpStatus.OK);
    res.headers({ 'x-request-id': req.id });

    return next.handle().pipe(
      map((data): BaseResponseDto<Record<string, any>> => {
        const response = new BaseResponseDto<Record<string, any>>();

        response.success = true;
        response.request_id = req.id;

        if (data instanceof BasePaginatedResponseDto) {
          response.data = data.items.map((item) => {
            if (item instanceof BaseEntity) {
              return item.toJSON();
            }
          });

          response.meta = data.meta;

          return response;
        } else {
          if (data instanceof BaseEntity) {
            response.data = data.toJSON();
          } else {
            response.data = instanceToPlain(data);
          }

          return response;
        }
      }),
    );
  }
}