import { Controller, Get } from '@nestjs/common';
import { RootService } from './root.service';
import { AbstractController } from '@ctrl/abstract.controller';

@Controller()
export class RootController extends AbstractController {
  constructor(private readonly appService: RootService) {
    super();
  }

  @Get()
  getHello(): { message: string } {
    return this.appService.getHello();
  }
}
