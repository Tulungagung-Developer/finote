import { Routes as NestRoutes } from '@nestjs/core';
import { RootModule } from '@ctrl/root.module';

export const Routes: NestRoutes = [{ path: '/', module: RootModule }];
