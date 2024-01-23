import { PartialType } from '@nestjs/mapped-types';
import { CreateStaffDto } from './create-staff.dto';
import { Exclude } from 'class-transformer';

export class UpdateStaffDto extends PartialType(CreateStaffDto) {
  @Exclude()
  username: string;

  @Exclude()
  email: string;

  @Exclude()
  password: string;
}
