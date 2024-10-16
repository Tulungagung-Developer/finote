import { ColumnOptions, Column } from 'typeorm';
import { deepmerge } from 'deepmerge-ts';
import { BooleanTransformer, DateTransformer } from '@libs/typeorm/column-transformer.typeorm';
import { DecimalNumber } from '@libs/helpers/decimal.helper';

export function ForeignColumn(options?: ColumnOptions): PropertyDecorator {
  return Column(deepmerge({ type: 'uuid' }, options || {}));
}

export function BooleanColumn(options?: ColumnOptions): PropertyDecorator {
  const columnOptions: ColumnOptions = deepmerge({ type: 'smallint' }, options || {});
  if (columnOptions.default) {
    columnOptions.default = columnOptions.default ? 1 : 0;
  } else {
    columnOptions.default = 0;
  }

  columnOptions.transformer = new BooleanTransformer();
  return Column(columnOptions);
}

export function DateTimeColumn(options?: ColumnOptions): PropertyDecorator {
  const columnOptions: ColumnOptions = deepmerge({ type: 'timestamp' }, options || {});
  columnOptions.transformer = new DateTransformer();

  return Column(columnOptions);
}

export function StringColumn(options?: ColumnOptions): PropertyDecorator {
  return Column(deepmerge({ type: 'varchar' }, options || {}));
}

export function NumberColumn(options?: ColumnOptions): PropertyDecorator {
  return Column(deepmerge({ type: 'int' }, options || {}));
}

export function JsonColumn(options?: ColumnOptions): PropertyDecorator {
  return Column(deepmerge({ type: 'jsonb' }, options || {}));
}

export function AmountColumn(options?: ColumnOptions): PropertyDecorator {
  const columnOptions = deepmerge({ type: 'numeric', precision: 10, scale: 2 }, options || {});
  columnOptions.transformer = {
    to(value?: DecimalNumber) {
      if (!value) return 0;
      return value.toString();
    },

    from(value?: any) {
      if (!value) return new DecimalNumber(0);
      return new DecimalNumber(value);
    },
  };
  return Column(columnOptions);
}
