import { Exclude, Expose, Transform } from 'class-transformer';

export class LoginResponseDto {
  @Expose({ name: 'id' })
  @Transform(({ obj }) => obj._id.toString())
  private _id: string;

  username: string;

  fullName: string;

  role: string;

  accessToken: string;

  @Exclude()
  password: string;

  constructor(partial: Partial<LoginResponseDto>) {
    Object.assign(this, partial);
  }
}
