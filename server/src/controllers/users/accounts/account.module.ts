import { Module } from '@nestjs/common';
import { AccountController } from '@ctrl/users/accounts/account.controller';

@Module({
  controllers: [AccountController],
})
export class AccountModule {}
