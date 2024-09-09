import { Routes as NestRoutes } from '@nestjs/core';
import { RootModule } from '@ctrl/root/root.module';
import { AuthModule } from '@ctrl/auth/auth.module';

export const Routes: NestRoutes = [
  { path: '/', module: RootModule },
  { path: '/auth', module: AuthModule },
];
