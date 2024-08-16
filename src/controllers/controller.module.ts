import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { Routes } from '@ctrl/controller.route';
import { RootModule } from '@ctrl/root.module';
import { JwtModule } from '@nestjs/jwt';
import { EnvConfig } from '@conf/env.config';
import { AuthModule } from '@ctrl/auth/auth.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: EnvConfig.get('JWT_SECRET').toBeDefined(),
      signOptions: { expiresIn: '3d' },
    }),
    RouterModule.register(Routes),
    RootModule,
    AuthModule,
  ],
  exports: [RouterModule],
})
export class ControllerModule {}
