import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ProductCollection } from '@/models/product-collections/schemas/product-collection.schema';
import mongoose from 'mongoose';
import { SYSTEM } from '@/common/constants';

@Schema({ versionKey: false })
export class ProductType {
  @Prop({ required: true })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: ProductCollection.name,
    required: true,
  })
  collection: ProductCollection;

  @Prop({ required: false, default: new Date() })
  createdAt: Date;

  @Prop({ required: false })
  updatedAt: Date;

  @Prop({ required: false, default: SYSTEM })
  createdBy: string;

  @Prop({ required: false })
  updatedBy: string;
}

export const ProductTypeSchema = SchemaFactory.createForClass(ProductType);
