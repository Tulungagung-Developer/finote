import { FastifyRequest, RequestContext } from '@core/interceptors/request.interceptor';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ReqContext = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<FastifyRequest>();
  return request.requestContext as RequestContext;
});
