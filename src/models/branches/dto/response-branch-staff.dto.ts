import { Exclude } from 'class-transformer';
import { Branch } from '@/models/branches/schemas/branch.schema';
import mongoose from 'mongoose';
import { ResponseStaffDto } from '@/models/staff/dto';

export class ResponseBranchStaffDto extends ResponseStaffDto {
  @Exclude()
  branch: Branch & { _id?: mongoose.Schema.Types.ObjectId };
}
