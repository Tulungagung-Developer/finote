import { MakeEnv } from '@conf/env.config';
import { MakeSentry } from '@conf/sentry.config';

MakeEnv.initialize({
  ensureKeys: [
    'PORT',
    'DEBUG',
    'DATABASE_HOST',
    'DATABASE_PORT',
    'DATABASE_USERNAME',
    'DATABASE_PASSWORD',
    'DATABASE_NAME',
  ],
});

MakeSentry.initialize();
