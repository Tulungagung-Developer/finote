import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { Routes } from '@ctrl/controller.route';
import { RootModule } from '@ctrl/root/root.module';
import { AuthModule } from '@ctrl/auth/auth.module';

@Module({
  imports: [RouterModule.register(Routes), RootModule, AuthModule],
  exports: [RouterModule],
})
export class ControllerModule {}
