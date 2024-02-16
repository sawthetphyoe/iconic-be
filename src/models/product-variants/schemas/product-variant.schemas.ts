import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Product } from '@/models/products/schemas/product.schema';

@Schema({ versionKey: false })
export class ProductVariant {
  @Prop({type:mongoose.Schema.Types.ObjectId, required: true, ref: Product.name})
  product: Product;

  @Prop({required: true})
  color: string;

  @Prop({required: true})
  processor: string;

  @Prop({required: true})
  ram: string;

  @Prop({required: true})
  storage: string;

  @Prop({required: true})
  price: number;

  @Prop({required: false, default: new Date()})
  createdAt: Date;

  @Prop({required: false})
  updatedAt: Date;

  @Prop({required: false, default: 'SYSTEM'})
  createdBy: string;

  @Prop({required: false})
  updatedBy: string;
}
export const ProductVariantSchema = SchemaFactory.createForClass(ProductVariant);