import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsPasswordMatch' })
export class MatchConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const relatedValue = (args.object as any)[args.constraints[0]];
    return value === relatedValue;
  }

  defaultMessage(): string {
    return 'Passwords do not match';
  }
}

export function IsPasswordMatch(
  comparedTo: string = 'password',
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [comparedTo],
      validator: MatchConstraint,
    });
  };
}
