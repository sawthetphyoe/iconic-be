import { Expose, Transform } from 'class-transformer';

export class ResponseProductCollectionDto {
  @Expose({ name: 'id' })
  @Transform(({ obj }) => obj._id.toString())
  private _id: string;

  constructor(partial: Partial<ResponseProductCollectionDto>) {
    Object.assign(this, partial);
  }
}
