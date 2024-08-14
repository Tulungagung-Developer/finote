import { Module } from '@nestjs/common';
import { RootController } from '@ctrl/root.controller';
import { RootService } from '@ctrl/root.service';

@Module({
  providers: [RootService],
  controllers: [RootController],
})
export class RootModule {}
