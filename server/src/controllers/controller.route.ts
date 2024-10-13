import { Routes as NestRoutes } from '@nestjs/core';
import { RootModule } from '@ctrl/root/root.module';
import { AuthModule } from '@ctrl/auth/auth.module';
import { UserModule } from '@ctrl/users/user.module';
import { AccountModule } from './users/accounts/account.module';

export const Routes: NestRoutes = [
  { path: '/', module: RootModule },
  { path: '/auth', module: AuthModule },
  {
    path: '/me',
    module: UserModule,
    children: [
      {
        path: '/accounts',
        module: AccountModule,
      },
    ],
  },
];
