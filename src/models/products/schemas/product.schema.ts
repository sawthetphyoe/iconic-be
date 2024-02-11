import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ProductType } from '@/models/product-types/schemas/product-type.schema';
import mongoose from 'mongoose';
import { SYSTEM } from '@/common/constants';
import { ProductColorImage } from '@/interfaces';

@Schema({ versionKey: false })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: ProductType.name,
    required: true,
  })
  productType: ProductType;

  @Prop({ required: false })
  keyFeatures: string[];

  @Prop({ required: false, default: 0 })
  available: number;

  @Prop({ required: false })
  images: ProductColorImage[];

  @Prop({ required: false })
  processors: string[];

  @Prop({ required: false })
  rams: string[];

  @Prop({ required: false })
  storages: string[];

  @Prop({ required: false, default: new Date() })
  createdAt: Date;

  @Prop({ required: false })
  updatedAt: Date;

  @Prop({ required: false, default: SYSTEM })
  createdBy: string;

  @Prop({ required: false })
  updatedBy: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
