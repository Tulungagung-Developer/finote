import { ValidationError } from 'class-validator';

export class ValidationException extends Error {
  details: string[];

  constructor(private readonly errors: ValidationError[]) {
    super('Failed to validate request');

    this.name = 'ValidationException';
    this.details = errors.map((e) => (e.constraints ? Object.values(e.constraints) : [])).flat();
  }
}
