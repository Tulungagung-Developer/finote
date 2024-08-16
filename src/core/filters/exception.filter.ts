import { Catch, HttpException, ExceptionFilter as Filter, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { FastifyReply } from 'fastify';

type ErrorPayload = {
  code: number;
  message: string;
  details?: string[];
};

@Catch(Error, HttpException)
export class ExceptionFilter implements Filter {
  catch(exception: Error | HttpException, host: ArgumentsHost) {
    const req = host.switchToHttp().getRequest();
    const res = host.switchToHttp().getResponse<FastifyReply>();

    const error: ErrorPayload = {
      code: exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR,
      message: exception.message ?? 'Something went wrong in the server',
    };

    res.status(HttpStatus.OK).send({
      success: false,
      request_id: req.id,
      data: null,
      error,
    });
  }
}
