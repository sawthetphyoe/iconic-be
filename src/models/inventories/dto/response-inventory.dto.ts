import { Exclude, Expose, Transform } from 'class-transformer';
import { Product } from '@/models/products/schemas/product.schema';
import mongoose from 'mongoose';
import { ProductVariant } from '@/models/product-variants/schemas/product-variant.schema';
import { Branch } from '@/models/branches/schemas/branch.schema';

export class ResponseInventoryDto {
  @Expose({ name: 'id' })
  @Transform(({ obj }) => obj._id.toString())
  id: string;

  @Exclude()
  _id: mongoose.Types.ObjectId;

  @Transform(({ obj }) => new ResponseInventoryBranchDto(obj.branch))
  branch: Branch & { _id?: mongoose.Schema.Types.ObjectId };

  @Expose({ name: 'product' })
  @Transform(({ obj }) => new ResponseInventoryProductDto(obj.productVariant))
  productVariant: ProductVariant & {
    _id?: mongoose.Schema.Types.ObjectId;
  };

  quantity: number;

  constructor(partial: Partial<ResponseInventoryDto>) {
    Object.assign(this, partial);
  }
}

export class ResponseInventoryBranchDto {
  @Expose({ name: 'id' })
  @Transform(({ obj }) => obj._id.toString())
  _id: string;

  constructor(partial: Partial<ResponseInventoryBranchDto>) {
    Object.assign(this, partial);
  }
}

export class ResponseInventoryProductDto {
  @Expose()
  @Transform(({ obj }) => obj.product._id.toString())
  id: string;

  @Expose()
  @Transform(({ obj }) => obj.product.name)
  name: string;

  @Expose()
  @Transform(({ obj }) => ({
    id: obj._id.toString(),
    color: obj.color,
    processor: obj.processor,
    ram: obj.ram,
    storage: obj.storage,
    price: obj.price,
  }))
  variant: {
    id: string;
    color: string;
    processor: string;
    ram: string;
    storage: string;
    price: string;
  };

  @Exclude()
  @Transform(({ obj }) => obj._id.toString())
  _id: string;

  @Exclude()
  product: Product & { _id?: mongoose.Schema.Types.ObjectId };

  @Exclude()
  color: string;

  @Exclude()
  processor: string;

  @Exclude()
  ram: string;

  @Exclude()
  storage: string;

  @Exclude()
  price: number;

  constructor(partial: Partial<ResponseInventoryProductDto>) {
    Object.assign(this, partial);
  }
}
