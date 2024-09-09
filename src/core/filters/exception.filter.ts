import { AbstractException } from '@core/exceptions/abstract.exception';
import { Catch, HttpException, ExceptionFilter as Filter, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { ErrorResponseDto } from '@core/dtos/base.dto';
import { FastifyReply } from 'fastify';

@Catch()
export class ExceptionFilter implements Filter {
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

    res.status(HttpStatus.OK).send({
      success: false,
      request_id: req.id,
      error,
    });
  }
}
