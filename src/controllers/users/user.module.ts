import { Module } from '@nestjs/common';
import { UserController } from '@ctrl/users/user.controller';

@Module({
  controllers: [UserController],
})
export class UserModule {}
