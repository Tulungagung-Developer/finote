import { ValidationPipeOptions } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { ValidationException } from '@core/exceptions/validation.exception';

export const ValidatorConfig: ValidationPipeOptions = {
  whitelist: true,
  exceptionFactory: (errors: ValidationError[]) => new ValidationException(errors),
};
