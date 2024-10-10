import { Logger } from '@nestjs/common';

export abstract class AbstractController {
  protected readonly logger = new Logger(this.constructor.name);
}
