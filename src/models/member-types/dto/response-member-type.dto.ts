import { Expose, Transform } from 'class-transformer';

export class ResponseMemberTypeDto {
  @Expose({ name: 'id' })
  @Transform(({ obj }) => obj._id.toString())
  private _id: string;

  name: string;

  minAmount: number;

  constructor(partial: Partial<ResponseMemberTypeDto>) {
    Object.assign(this, partial);
  }
}
