import { Exclude, Expose, Transform } from 'class-transformer';

export class ResponseStaffDto {
  @Expose({ name: 'id' })
  @Transform(({ obj }) => obj._id.toString())
  private _id: string;

  username: string;

  fullName: string;

  email: string;

  role: string;

  branch: string;

  @Exclude()
  password: string;

  createdAt: Date;

  updatedAt: Date;

  createdBy: string;

  updatedBy: string;

  constructor(partial: Partial<ResponseStaffDto>) {
    Object.assign(this, partial);
  }
}
