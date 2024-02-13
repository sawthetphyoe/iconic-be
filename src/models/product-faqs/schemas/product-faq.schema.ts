import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Product } from '@/models/products/schemas/product.schema';

@Schema({ versionKey: false })
export class ProductFaq {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: Product.name })
  productId: Product;

  @Prop({ required: true })
  question: string;

  @Prop({ required: true })
  answer: string;

  @Prop({ required: false, default: new Date() })
  createdAt: Date;

  @Prop({ required: false })
  updatedAt: Date;

  @Prop({ required: false, default: 'SYSTEM' })
  createdBy: string;

  @Prop({ required: false })
  updatedBy: string;
}

export const ProductFaqSchema = SchemaFactory.createForClass(ProductFaq);