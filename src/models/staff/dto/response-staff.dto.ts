import { Exclude, Expose, Transform } from 'class-transformer';
import { Branch } from '@/models/branches/schemas/branch.schema';
import mongoose from 'mongoose';

export class ResponseStaffDto {
  @Expose({ name: 'id' })
  @Transform(({ obj }) => obj._id.toString())
  private _id: string;

  @Transform(({ obj }) => new ResponseStaffBranch(obj.branch))
  branch: Branch & { _id?: mongoose.Schema.Types.ObjectId };

  @Exclude()
  password: string;

  constructor(partial: Partial<ResponseStaffDto>) {
    Object.assign(this, partial);
  }
}

class ResponseStaffBranch {
  @Expose({ name: 'id' })
  @Transform(({ obj }) => obj._id.toString())
  private _id: string;

  @Exclude()
  staffCount: number;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  createdBy: string;

  @Exclude()
  updatedBy: string;
  constructor(partial: Partial<ResponseStaffBranch>) {
    Object.assign(this, partial);
  }
}
