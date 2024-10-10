import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@db/entities/core/user.entity';

export const Me = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<{ user: User }>();
  if (!request.user) return new User();

  return request.user;
});
