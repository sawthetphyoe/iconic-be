import { Exclude, Expose, Transform } from 'class-transformer';
import mongoose from 'mongoose';
import { ProductType } from '@/models/product-types/schemas/product-type.schema';
import { ProductColorImage } from '@/interfaces';

export class ResponseProductDto {
  @Expose({ name: 'id' })
  @Transform(({ obj }) => obj._id.toString())
  private _id: string;

  @Transform(({ obj }) => new ResponseProductType(obj.productType))
  productType: ProductType & {
    _id?: mongoose.Schema.Types.ObjectId;
  };

  name: string;

  images: ProductColorImage[];

  constructor(partial: Partial<ResponseProductDto>) {
    Object.assign(this, partial);
  }
}

class ResponseProductType {
  @Expose({ name: 'id' })
  @Transform(({ obj }) => obj._id.toString())
  private _id: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  createdBy: string;

  @Exclude()
  updatedBy: string;

  constructor(partial: Partial<ResponseProductType>) {
    Object.assign(this, partial);
  }
}
