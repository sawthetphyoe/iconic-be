import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { ProductType } from '@/models/product-types/schemas/product-type.schema';

@Injectable()
@ValidatorConstraint({ name: 'IsUniqueConstraint', async: true })
export class UniqueProductTypeValidator
  implements ValidatorConstraintInterface
{
  constructor(
    @InjectModel(ProductType.name)
    private readonly model: Model<ProductType>,
  ) {}

  async validate(value: string) {
    const data = await this.model.findOne({ name: value });
    return !data;
  }
  defaultMessage(): string {
    return `Product Type name already exists`;
  }
}

export function IsUniqueProductType(validationOptions?: ValidationOptions) {
  return function (target: any, propertyName: string) {
    registerDecorator({
      target: target.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: UniqueProductTypeValidator,
    });
  };
}
