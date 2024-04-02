import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class MemberType {
  @Prop({ unique: true, required: true })
  name: string;

  @Prop({ required: true })
  minAmount: number;

  @Prop({ required: true, default: new Date() })
  createdAt: Date;

  @Prop({ required: false })
  updatedAt: Date;

  @Prop({ required: false, default: 'Admin User' })
  createdBy: string;

  @Prop({ required: false })
  updatedBy: string;
}

export const MemberTypeSchema = SchemaFactory.createForClass(MemberType);
