import { ErrorResponseDto } from '@core/dtos/base.dto';

export abstract class AbstractException extends Error {
  code: number;
  message: string;
  details?: string[] = [];

  protected constructor() {
    super();
    this.name = this.constructor.name;
  }

  getResponse(): ErrorResponseDto {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
    };
  }
}
