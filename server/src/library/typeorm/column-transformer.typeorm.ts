import { ValueTransformer } from 'typeorm';
import { time } from '@libs/helpers/time.helper';

export class BooleanTransformer implements ValueTransformer {
  to(value?: boolean): number {
    return value ? 1 : 0;
  }

  from(value?: number): boolean {
    return value === 1;
  }
}

export class DateTransformer implements ValueTransformer {
  to(value?: time.Dayjs) {
    if (value && value.isValid()) {
      return value.toDate();
    }
  }

  from(value?: Date) {
    if (value) {
      return time(value);
    }

    return null;
  }
}
