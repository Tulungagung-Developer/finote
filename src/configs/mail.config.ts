import { EnvConfig } from '@conf/env.config';
import { MailerOptions } from '@nestjs-modules/mailer';

export const MailerConfig: MailerOptions = {
  transport: `smtp://${EnvConfig.get('MAIL_USERNAME').value}:${EnvConfig.get('MAIL_PASSWORD').value}@${EnvConfig.get('MAIL_HOST').value}`,
  defaults: {
    from: `No Reply <${EnvConfig.get('MAIL_USERNAME').value}>`,
  },
};
