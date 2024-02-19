import { ResponseInventoryDto } from '@/models/inventories/dto';
import { Exclude, Expose, Transform } from 'class-transformer';
import { Branch } from '@/models/branches/schemas/branch.schema';
import mongoose from 'mongoose';

export class ResponseBranchItemDto extends ResponseInventoryDto {
  @Exclude()
  branch: Branch & { _id?: mongoose.Schema.Types.ObjectId };

  @Expose({ name: 'inventoryId' })
  @Transform(({ obj }) => obj._id.toString())
  id: string;
}
