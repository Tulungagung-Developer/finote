import { MakeEnv } from '@conf/env.config';
import { SentryConfig } from '@conf/sentry.config';

MakeEnv.initialize({ ensureKeys: ['PORT', 'DEBUG', 'JWT_SECRET'] });
SentryConfig();
