import { Expose, Transform } from 'class-transformer';
import { ResponseOrderDetailsDto } from '@/models/orders/dto/response-order-details.dto';
import mongoose from 'mongoose';

export class ResponseOrderDto {
  @Expose({ name: 'id' })
  @Transform(({ obj }) => obj._id.toString())
  _id: mongoose.Types.ObjectId;

  customer: string;

  paymentType: string;

  orderItems: ResponseOrderDetailsDto[];

  constructor(partial: Partial<ResponseOrderDto>) {
    Object.assign(this, partial);
  }
}
