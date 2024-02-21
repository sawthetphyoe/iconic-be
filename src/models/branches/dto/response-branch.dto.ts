import { Expose, Transform } from 'class-transformer';

export class ResponseBranchDto {
  @Expose({ name: 'id' })
  @Transform(({ obj }) => obj._id.toString())
  private _id: string;

  name: string;

  constructor(partial: Partial<ResponseBranchDto>) {
    Object.assign(this, partial);
  }
}
