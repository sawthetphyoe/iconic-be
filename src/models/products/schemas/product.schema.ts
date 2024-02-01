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

  @Prop({ required: false, default: 0 })
  inStock: number;

  @Prop({ required: false })
  availableColors: ProductColorImage[];

  @Prop({ required: false })
  availableCpus: string[];

  @Prop({ required: false })
  availableRams: string[];

  @Prop({ required: false })
  availableStorages: string[];

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
