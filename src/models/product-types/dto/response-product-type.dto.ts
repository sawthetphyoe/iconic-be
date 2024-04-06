import { Expose, Transform } from 'class-transformer';
import mongoose from 'mongoose';

export class ResponseProductTypeDto {
  @Expose({ name: 'id' })
  @Transform(({ obj }) => obj._id.toString())
  _id: mongoose.Types.ObjectId;

  constructor(partial: Partial<ResponseProductTypeDto>) {
    Object.assign(this, partial);
  }
}
