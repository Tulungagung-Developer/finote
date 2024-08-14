import { FastifyHttpOptions, RawRequestDefaultExpression } from 'fastify';
import { uuid } from '@libs/uid/uuid.library';
import { Logger } from '@nestjs/common';

const logger = new Logger('Fastify');

export const FastifyConfig: FastifyHttpOptions<any> = {
  trustProxy: true,
  genReqId: (req: RawRequestDefaultExpression) => (req.headers['x-request-id'] as string) || uuid(),
  logger: {
    stream: {
      write: (msg: string) => logger.debug(msg.trim()),
    },
    serializers: {
      req: (req) => ({
        method: req.method,
        url: req.url,
        headers: req.headers,
        remoteAddress: req.ip,
      }),
    },
  },
};
