import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { Routes } from '@ctrl/controller.route';
import { RootModule } from '@ctrl/root/root.module';
import { AuthModule } from '@ctrl/auth/auth.module';
import { UserModule } from '@ctrl/users/user.module';

@Module({
  imports: [RouterModule.register(Routes), RootModule, AuthModule, UserModule],
  exports: [RouterModule],
})
export class ControllerModule {}
