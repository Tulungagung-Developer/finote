import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { EnvConfig } from '@conf/env.config';
import { UserService } from '@core/services/user.service';

@Module({
  imports: [
    JwtModule.register({
      secret: EnvConfig.get('JWT_SECRET').toBeDefined(),
      signOptions: { expiresIn: '3d' },
      global: true,
    }),
  ],
  providers: [UserService],
  exports: [UserService],
})
export class CoreModule {}
