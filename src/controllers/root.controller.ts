import { Controller, Get } from '@nestjs/common';
import { RootService } from './root.service';

@Controller()
export class RootController {
  constructor(private readonly appService: RootService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
