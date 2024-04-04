import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { SYSTEM } from '@/common/constants';
import { MemberType } from '@/models/member-types/schemas/member-type.schema';
import { UserRole } from '@/enums';

@Schema({ versionKey: false })
export class Customer {
  @Prop({ required: true })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: MemberType.name,
    required: true,
  })
  memberType: MemberType;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true, default: UserRole.CUSTOMER })
  role: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: new Date() })
  createdAt: Date;

  @Prop({ required: false })
  updatedAt: Date;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);

////////// PRE MIDDLEWARES
CustomerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
