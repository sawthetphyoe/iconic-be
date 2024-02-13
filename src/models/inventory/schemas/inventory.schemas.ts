import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Branch } from '@/models/branches/schemas/branch.schema';
import { Product } from '@/models/products/schemas/product.schema';

@Schema({ versionKey: false })
export class Inventory {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: Branch.name })
  branch: Branch;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: Product.name })
  productVariant: string;

  @Prop({ required: true })
  inStock: number;

  @Prop({ required: false, default: new Date() })
  createdAt: Date;

  @Prop({ required: false })
  updatedAt: Date;

  @Prop({ required: false, default: 'SYSTEM' })
  createdBy: string;

  @Prop({ required: false })
  updatedBy: string;
}
export const InventorySchema = SchemaFactory.createForClass(Inventory);
