import { Expose, Transform } from 'class-transformer';

export class ResponseProductTypeDto {
  @Expose({ name: 'id' })
  @Transform(({ obj }) => obj._id.toString())
  private _id: string;

  constructor(partial: Partial<ResponseProductTypeDto>) {
    Object.assign(this, partial);
  }
}
