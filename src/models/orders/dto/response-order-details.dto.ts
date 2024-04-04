import { Exclude, Expose, Transform } from 'class-transformer';
import mongoose from 'mongoose';
import { ProductVariant } from '@/models/product-variants/schemas/product-variant.schema';
import { ResponseInventoryProductDto } from '@/models/inventories/dto';

export class ResponseOrderDetailsDto {
  @Expose({ name: 'id' })
  @Transform(({ obj }) => obj._id.toString())
  private _id: string;

  @Expose({ name: 'product' })
  @Transform(({ obj }) => new ResponseOrderProductVariant(obj.productVariant))
  productVariant: ProductVariant & {
    _id?: mongoose.Schema.Types.ObjectId;
  };

  subTotal: number;

  constructor(partial: Partial<ResponseOrderDetailsDto>) {
    Object.assign(this, partial);
  }
}

class ResponseOrderProductVariant extends ResponseInventoryProductDto {
  @Expose()
  @Transform(({ obj }) => ({
    id: obj._id.toString(),
    color: obj.color,
    processor: obj.processor,
    ram: obj.ram,
    storage: obj.storage,
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
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  createdBy: string;

  @Exclude()
  updatedBy: string;
}
