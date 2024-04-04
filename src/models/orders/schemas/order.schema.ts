import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Customer } from '@/models/customers/schemas/customer.schema';
import { PaymentType } from '@/models/payment-types/schemas/payment-type.schema';
import { OrderStatus } from '@/enums';

@Schema({ versionKey: false })
export class Order {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Customer.name,
    required: true,
  })
  customer: Customer;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: PaymentType.name,
    required: true,
  })
  paymentType: PaymentType;

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ required: true, default: OrderStatus.PENDING })
  status: string;

  @Prop({ required: true, default: new Date() })
  createdAt: Date;

  @Prop({ required: false })
  updatedAt: Date;

  @Prop({ required: false })
  updatedBy: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
