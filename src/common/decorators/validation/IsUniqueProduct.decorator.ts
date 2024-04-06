import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Product } from '@/models/products/schemas/product.schema';

@Injectable()
@ValidatorConstraint({ name: 'UniqueProductValidator', async: true })
export class UniqueProductValidator implements ValidatorConstraintInterface {
  constructor(
    @InjectModel(Product.name)
    private readonly model: Model<Product>,
  ) {}

  async validate(value: string) {
    const data = await this.model.findOne({ name: value });
    console.log(data);
    return !data;
  }
  defaultMessage(): string {
    return `Product name already exists`;
  }
}

export function IsUniqueProduct(validationOptions?: ValidationOptions) {
  return function (target: any, propertyName: string) {
    registerDecorator({
      target: target.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: UniqueProductValidator,
    });
  };
}
