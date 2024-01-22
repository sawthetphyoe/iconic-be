import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
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

  @Prop({ required: true })
  branch: string;

  @Prop({ required: true })
  created_at: Date;

  @Prop({ required: false })
  updated_at: Date;

  @Prop({ required: false })
  created_by: string;

  @Prop({ required: false })
  updated_by: string;
}

export const StaffSchema = SchemaFactory.createForClass(Staff);
