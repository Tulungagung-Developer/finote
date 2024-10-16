import { Module } from '@nestjs/common';
import { UserController } from '@ctrl/users/user.controller';
import { AccountModule } from './accounts/account.module';

@Module({
  imports: [AccountModule],
  controllers: [UserController],
})
export class UserModule {}
