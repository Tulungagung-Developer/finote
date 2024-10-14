import { cloneDeep } from 'lodash';

export interface IRetryOptions {
  maxAttempts?: number;
  delay?: number;
}

export class Retry<P, R> {
  private readonly fn: (param: P) => Promise<R>;

  private errorInstances: Array<new (...args: any[]) => Error> = [Error];
  private maxAttempts: number = 3;
  private delay: number = 1000;
  private attempts: number = 0;

  private constructor(fn: (param: P) => Promise<R>) {
    this.fn = fn;
  }

  static create<P, R>(fn: (param: P) => Promise<R>): Retry<P, R> {
    return new Retry<P, R>(fn);
  }

  configure(options: Partial<IRetryOptions> = {}): this {
    this.maxAttempts = options.maxAttempts ?? this.maxAttempts;
    this.delay = options.delay ?? this.delay;
    return this;
  }

  catch<E extends Error>(errorInstance: new (...args: any[]) => E): this {
    this.errorInstances = [errorInstance];
    return this;
  }

  andCatch<E extends Error>(errorInstance: new (...args: any[]) => E): this {
    this.errorInstances.push(errorInstance);
    return this;
  }

  async execute(param: P): Promise<R> {
    try {
      return await this.fn(cloneDeep(param));
    } catch (error) {
      if (this.errorInstances.every((e) => !(error instanceof e)) || ++this.attempts >= this.maxAttempts) throw error;

      await new Promise((resolve) => setTimeout(resolve, this.delay * this.attempts));
      return this.execute(param);
    }
  }
}
