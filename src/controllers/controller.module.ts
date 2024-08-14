import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { Routes } from '@ctrl/controller.route';
import { RootModule } from '@ctrl/root.module';

@Module({
  imports: [RouterModule.register(Routes), RootModule],
  exports: [RouterModule],
})
export class ControllerModule {}
