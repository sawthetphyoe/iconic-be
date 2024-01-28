import { Exclude, Expose, Transform } from 'class-transformer';
import mongoose from 'mongoose';
import { ProductCollection } from '@/models/product-collections/schemas/product-collection.schema';

export class ResponseProductTypeDto {
  @Expose({ name: 'id' })
  @Transform(({ obj }) => obj._id.toString())
  private _id: string;

  @Transform(({ obj }) => new ResponseProductTypeCollection(obj.collection))
  collection: ProductCollection & { _id?: mongoose.Schema.Types.ObjectId };

  constructor(partial: Partial<ResponseProductTypeDto>) {
    Object.assign(this, partial);
  }
}

class ResponseProductTypeCollection {
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

  constructor(partial: Partial<ResponseProductTypeCollection>) {
    Object.assign(this, partial);
  }
}