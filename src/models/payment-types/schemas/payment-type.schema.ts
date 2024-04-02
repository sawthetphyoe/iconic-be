import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SYSTEM } from '@/common/constants';

@Schema({ versionKey: false })
export class PaymentType {
  @Prop({ unique: true, required: true })
  name: string;

  @Prop({ required: false, default: new Date() })
  createdAt: Date;

  @Prop({ required: false })
  updatedAt: Date;

  @Prop({ required: false, default: SYSTEM })
  createdBy: string;

  @Prop({ required: false })
  updatedBy: string;
}

export const PaymentTypeSchema = SchemaFactory.createForClass(PaymentType);
