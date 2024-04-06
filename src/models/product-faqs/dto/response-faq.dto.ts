import { Expose, Transform } from 'class-transformer';
import mongoose from 'mongoose';

export class ResponseFaqDto {
  @Expose({ name: 'id' })
  @Transform(({ obj }) => obj._id.toString())
  _id: mongoose.Types.ObjectId;

  @Transform(({ obj }) => new ResponseProduct(obj.product))
  product: any;

  question: string;

  answer: string;

  constructor(partial: Partial<ResponseFaqDto>) {
    Object.assign(this, partial);
  }
}

class ResponseProduct {
  @Expose({ name: 'id' })
  @Transform(({ obj }) => obj._id.toString())
  private _id: string;

  constructor(partial: Partial<ResponseProduct>) {
    Object.assign(this, partial);
  }
}
