import { Exclude, Expose, Transform } from 'class-transformer';

export class ResponseLoginDto {
  @Expose({ name: 'id' })
  @Transform(({ obj }) => obj._id.toString())
  private _id: string;

  @Exclude()
  password: string;

  accessToken: string;

  memberType: string;
  constructor(partial: Partial<ResponseLoginDto>) {
    Object.assign(this, partial);
  }
}
