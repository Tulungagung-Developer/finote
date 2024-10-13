import { AbstractException } from '@core/exceptions/abstract.exception';
import { Catch, HttpException, ExceptionFilter as Filter, ArgumentsHost, HttpStatus, Logger } from '@nestjs/common';
import { ErrorResponseDto } from '@core/dtos/base.dto';
import { FastifyReply } from 'fastify';
import * as Sentry from '@sentry/node';
import { EnvConfig } from '@conf/env.config';

@Catch()
export class ExceptionFilter implements Filter {
  private readonly logger = new Logger(ExceptionFilter.name);

  catch(exception: Error | HttpException, host: ArgumentsHost) {
    const req = host.switchToHttp().getRequest();
    const res = host.switchToHttp().getResponse<FastifyReply>();

    res.headers({ 'x-request-id': req.id });

    if (exception instanceof AbstractException) {
      return res.status(HttpStatus.OK).send({ success: false, request_id: req.id, error: exception.getResponse() });
    }

    const error: ErrorResponseDto = {
      code: exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR,
      message: exception.message ?? 'Something went wrong in the server',
    };

    if (error.code === HttpStatus.INTERNAL_SERVER_ERROR) {
      if (EnvConfig.get('SERVER_SENTRY_DSN').value) Sentry.captureException(exception);
      if (EnvConfig.Const().IS_DEVELOPMENT) this.logger.error(exception.stack);

      error.message = 'Something went wrong in the server';
    }

    res.status(HttpStatus.OK).send({
      success: false,
      request_id: req.id,
      error,
    });
  }
}
