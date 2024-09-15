import { ColumnOptions, Column } from 'typeorm';
import { deepmerge } from 'deepmerge-ts';

export function ForeignColumn(options?: ColumnOptions): PropertyDecorator {
  return Column(deepmerge({ type: 'uuid' }, options || {}));
}

export function BooleanColumn(options?: ColumnOptions): PropertyDecorator {
  const columnOptions: ColumnOptions = deepmerge({ type: 'boolean' }, options || {});
  if (columnOptions.default) {
    columnOptions.default = columnOptions.default ? 1 : 0;
  } else {
    columnOptions.default = 0;
  }

  return Column(columnOptions);
}

export function DateTimeColumn(options?: ColumnOptions): PropertyDecorator {
  return Column(deepmerge({ type: 'timestamp' }, options || {}));
}

export function StringColumn(options?: ColumnOptions): PropertyDecorator {
  return Column(deepmerge({ type: 'varchar' }, options || {}));
}

export function NumberColumn(options?: ColumnOptions): PropertyDecorator {
  return Column(deepmerge({ type: 'int' }, options || {}));
}
