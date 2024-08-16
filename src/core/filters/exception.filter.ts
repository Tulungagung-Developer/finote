import { Catch, HttpException, ExceptionFilter as Filter, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { ValidationException } from '@core/exceptions/validation.exception';

type ErrorPayload = {
  code: number;
  message: string;
  details?: string[];
};

@Catch(Error, HttpException, ValidationException)
export class ExceptionFilter implements Filter {
  catch(exception: Error | HttpException, host: ArgumentsHost) {
    const req = host.switchToHttp().getRequest();
    const res = host.switchToHttp().getResponse<FastifyReply>();

    const error: ErrorPayload = {
      code: exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR,
      message: exception.message ?? 'Something went wrong in the server',
    };

    if (exception instanceof ValidationException) {
      error.code = HttpStatus.BAD_REQUEST;
      error.details = exception.details;
    }

    res.status(HttpStatus.OK).send({
      success: false,
      request_id: req.id,
      data: null,
      error,
    });
  }
}
