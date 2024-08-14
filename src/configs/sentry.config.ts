import { EnvConfig } from '@conf/env.config';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

export function SentryConfig() {
  if (EnvConfig.get('SENTRY_DSN').value) {
    Sentry.init({
      dsn: EnvConfig.get('SENTRY_DSN').value,
      environment: EnvConfig.get('NODE_ENV').toBeDefined(),
      integrations: [nodeProfilingIntegration()],
      tracesSampleRate: 1.0,
      profilesSampleRate: 1.0,
    });
  }
}
