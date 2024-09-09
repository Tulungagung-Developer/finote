import { AbstractException } from '@core/exceptions/abstract.exception';
import { HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class ValidationException extends AbstractException {
  constructor(private readonly errors: ValidationError[]) {
    super();
    this.code = HttpStatus.BAD_REQUEST;
    this.message = 'Failed to validate request';
    this.details = errors.map((e) => (e.constraints ? Object.values(e.constraints) : [])).flat();
  }
}
