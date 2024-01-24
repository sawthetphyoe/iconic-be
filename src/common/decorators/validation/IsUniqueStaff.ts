import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Staff } from '@/models/staff/schemas/staff.schema';

@Injectable()
@ValidatorConstraint({ name: 'IsUniqueConstraint', async: true })
export class UniqueStaffValidator implements ValidatorConstraintInterface {
  constructor(
    @InjectModel(Staff.name)
    private readonly model: Model<Staff>,
  ) {}

  async validate(value: string, args: ValidationArguments) {
    const fieldName = args.constraints[0];
    const data = await this.model.findOne({ [fieldName]: value });
    return !data;
  }
  defaultMessage(args: ValidationArguments): string {
    const fieldName = args.constraints[0];
    return `${fieldName} already exists`;
  }
}

export function IsUniqueStaff(
  fieldName: string,
  validationOptions?: ValidationOptions,
) {
  return function (target: any, propertyName: string) {
    registerDecorator({
      target: target.constructor,
      propertyName,
      options: validationOptions,
      constraints: [fieldName],
      validator: UniqueStaffValidator,
    });
  };
}
