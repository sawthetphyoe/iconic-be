import { Exclude, Expose, Transform } from 'class-transformer';
import mongoose from 'mongoose';
import { MemberType } from '@/models/member-types/schemas/member-type.schema';

export class ResponseCustomerDto {
  @Expose({ name: 'id' })
  @Transform(({ obj }) => obj._id.toString())
  private _id: string;

  @Transform(({ obj }) => obj.memberType.name)
  memberType: MemberType & { _id?: mongoose.Schema.Types.ObjectId };

  @Exclude()
  password: string;

  constructor(partial: Partial<ResponseCustomerDto>) {
    Object.assign(this, partial);
  }
}
