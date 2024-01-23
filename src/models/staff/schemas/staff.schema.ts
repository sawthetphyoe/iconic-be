import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

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

  // TODO : Need to add password confirm

  @Prop({ required: true })
  role: string;

  @Prop({ required: false })
  branch: string;

  @Prop({ required: true, default: new Date() })
  createdAt: Date;

  @Prop({ required: false })
  updatedAt: Date;

  @Prop({ required: false, default: 'Admin User' })
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

///////// STATIC METHODS
StaffSchema.methods.isPasswordCorrect = async function (
  candidatePassword: string,
  userPassword: string,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
