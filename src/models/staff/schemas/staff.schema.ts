import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Branch } from '@/models/branches/schemas/branch.schema';
import mongoose from 'mongoose';
import { SYSTEM } from '@/common/constants';

@Schema({ versionKey: false })
export class Staff {
  @Prop({ unique: true, required: true })
  username: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  role: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Branch.name,
    required: false,
  })
  branch: Branch;

  @Prop({ required: true, default: new Date() })
  createdAt: Date;

  @Prop({ required: false })
  updatedAt: Date;

  @Prop({ required: false, default: SYSTEM })
  createdBy: string;

  @Prop({ required: false })
  updatedBy: string;
}

export const StaffSchema = SchemaFactory.createForClass(Staff);

////////// PRE MIDDLEWARES
StaffSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
