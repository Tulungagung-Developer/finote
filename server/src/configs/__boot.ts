import { MakeEnv } from '@conf/env.config';
import { MakeSentry } from '@conf/sentry.config';

MakeEnv.initialize({
  ensureKeys: [
    'SERVER_PORT',
    'DEBUG',
    'COOKIE_SECRET',
    'DATABASE_HOST',
    'DATABASE_PORT',
    'DATABASE_USERNAME',
    'DATABASE_PASSWORD',
    'DATABASE_NAME',
    'DATABASE_SSL',
    'MAIL_HOST',
    'MAIL_USERNAME',
    'MAIL_PASSWORD',
  ],
});

MakeSentry.initialize();
