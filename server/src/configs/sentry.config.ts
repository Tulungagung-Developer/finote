import { EnvConfig } from '@conf/env.config';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

export class MakeSentry {
  private static _instance: MakeSentry;

  private constructor() {
    if (EnvConfig.get('SERVER_SENTRY_DSN').value) {
      Sentry.init({
        dsn: EnvConfig.get('SERVER_SENTRY_DSN').value,
        environment: EnvConfig.get('NODE_ENV').toBeDefined(),
        integrations: [nodeProfilingIntegration()],
        tracesSampleRate: 1.0,
        profilesSampleRate: 1.0,
      });
    }
  }

  static initialize() {
    return this._instance || (this._instance = new this());
  }
}
