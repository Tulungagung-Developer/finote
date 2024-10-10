import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '@core/services/user.service';
import { GuardService } from '@core/services/guard.service';
import { AuthGuard } from '@core/guards/auth.guard';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailerConfig } from '@conf/mail.config';

@Module({
  imports: [JwtModule.register({}), MailerModule.forRoot(MailerConfig)],
  providers: [AuthGuard, GuardService, UserService],
  exports: [UserService, GuardService],
})
export class CoreModule {}
