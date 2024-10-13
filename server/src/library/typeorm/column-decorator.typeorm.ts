import { ColumnOptions, Column } from 'typeorm';
import { deepmerge } from 'deepmerge-ts';
import { BooleanTransformer, DateTransformer } from '@libs/typeorm/column-transformer.typeorm';

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

export function AmmountColumn(options?: ColumnOptions): PropertyDecorator {
  const columnOptions = deepmerge({ type: 'numeric', precision: 10, scale: 2 }, options || {});
  columnOptions.transformer = {
    to(value) {
      return value;
    },

    from(value) {
      return Number(value);
    },
  };
  return Column(columnOptions);
}
