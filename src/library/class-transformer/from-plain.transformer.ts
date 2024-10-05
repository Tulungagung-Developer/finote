import { ValidationException } from '@core/exceptions/validation.exception';
import { plainToInstance as transformer } from 'class-transformer';
import { ClassConstructor } from 'class-transformer/types/interfaces';
import { validate } from 'class-validator';

export async function plainToInstance<T, V>(cls: ClassConstructor<T>, plain: V): Promise<T> {
  const transformed = transformer(cls, plain);
  const errors = await validate(transformed as object);
  if (errors.length) throw new ValidationException(errors);

  return transformed;
}
