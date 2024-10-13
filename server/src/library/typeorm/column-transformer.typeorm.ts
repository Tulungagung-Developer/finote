import { FindOperator, ValueTransformer } from 'typeorm';
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
  to(value?: time.Dayjs | FindOperator<any>): Date | FindOperator<any> | null {
    if (value instanceof FindOperator) return value;

    const timeDayJs = time(value);
    if (timeDayJs.isValid()) return timeDayJs.toDate();

    return null;
  }

  from(value?: Date): time.Dayjs | null {
    if (value) return time(value);
    return null;
  }
}
