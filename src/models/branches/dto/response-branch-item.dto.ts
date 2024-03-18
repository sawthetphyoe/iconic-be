import { ResponseInventoryDto } from '@/models/inventories/dto';
import { Expose, Transform } from 'class-transformer';

export class ResponseBranchItemDto extends ResponseInventoryDto {
  // @Exclude()
  // branch: Branch & { _id?: mongoose.Schema.Types.ObjectId };

  @Expose({ name: 'inventoryId' })
  @Transform(({ obj }) => obj._id.toString())
  id: string;
}
