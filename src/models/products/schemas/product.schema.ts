import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class Product {
  @Prop({ required: true })
  name: string;
}
