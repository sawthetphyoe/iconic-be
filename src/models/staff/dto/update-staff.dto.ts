import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateStaffDto } from './create-staff.dto';

export class UpdateStaffDto extends PartialType(
  OmitType(CreateStaffDto, ['username', 'email', 'password'] as const),
) {}
