import { Controller, Get } from '@nestjs/common';
import { RootService } from './root.service';

@Controller()
export class RootController {
  constructor(private readonly appService: RootService) {}

  @Get()
  getHello() {
    throw new Error('Method not implemented.');
    return this.appService.getHello();
  }
}
