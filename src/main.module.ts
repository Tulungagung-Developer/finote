import { Global, Module } from '@nestjs/common';
import { ControllerModule } from '@ctrl/controller.module';
import { CoreModule } from '@core/core.module';

@Global()
@Module({
  imports: [ControllerModule, CoreModule],
  exports: [CoreModule],
})
export class MainModule {}
