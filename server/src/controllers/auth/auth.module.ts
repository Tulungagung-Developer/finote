import { Module } from '@nestjs/common';
import { AuthController } from '@ctrl/auth/auth.controller';

@Module({
  controllers: [AuthController],
})
export class AuthModule {}
