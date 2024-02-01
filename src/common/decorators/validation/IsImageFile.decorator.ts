import { registerDecorator, ValidationOptions } from 'class-validator';

interface IsFileOptions {
  mime: ('image/jpg' | 'image/png' | 'image/jpeg')[];
}

export function IsImageFile(
  options: IsFileOptions,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    return registerDecorator({
      name: 'isFile',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          return (
            value?.mimetype && (options?.mime ?? []).includes(value?.mimetype)
          );
        },
        defaultMessage(): string {
          return 'Invalid file type';
        },
      },
    });
  };
}
