import { Module } from '@nestjs/common';
import { RootController } from '@ctrl/root/root.controller';
import { RootService } from '@ctrl/root/root.service';

@Module({
  providers: [RootService],
  controllers: [RootController],
})
export class RootModule {}
