import { Expose, Transform } from 'class-transformer';
import mongoose from 'mongoose';

export class ResponsePaymentTypeDto {
  @Expose({ name: 'id' })
  @Transform(({ obj }) => obj._id.toString())
  _id: mongoose.Types.ObjectId;

  constructor(partial: Partial<ResponsePaymentTypeDto>) {
    Object.assign(this, partial);
  }
}
