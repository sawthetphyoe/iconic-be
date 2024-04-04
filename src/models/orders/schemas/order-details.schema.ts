import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Branch } from '@/models/branches/schemas/branch.schema';
import { ProductVariant } from '@/models/product-variants/schemas/product-variant.schema';
import { Order } from '@/models/orders/schemas/order.schema';

@Schema({ versionKey: false })
export class OrderDetails {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Branch.name,
    required: false,
  })
  branch: Branch;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: ProductVariant.name,
    required: true,
  })
  productVariant: ProductVariant;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Order.name,
    required: true,
  })
  order: Order;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, default: new Date() })
  createdAt: Date;

  @Prop({ required: false })
  updatedAt: Date;
}

export const OrderDetailsSchema = SchemaFactory.createForClass(OrderDetails);
