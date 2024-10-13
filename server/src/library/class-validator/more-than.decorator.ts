import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import { deepmerge } from 'deepmerge-ts';

export function IsMoreThan(property: string, validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    const options = deepmerge({ message: `${propertyName} must be greater than ${property}` }, validationOptions || {});

    registerDecorator({
      name: 'IsMoreThan',
      target: object.constructor,
      propertyName,
      options,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const relatedValue = (args.object as any)[property];
          return typeof value === 'number' && typeof relatedValue === 'number' && value > relatedValue;
        },
      },
    });
  };
}
