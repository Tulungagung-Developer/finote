import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { instanceToPlain } from 'class-transformer';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse<FastifyReply>();

    res.status(HttpStatus.OK);
    res.headers({ 'x-request-id': req.id });

    return next.handle().pipe(
      map((data) => ({
        success: true,
        request_id: req.id,
        data: instanceToPlain(data, { excludePrefixes: ['__'] }),
      })),
    );
  }
}
