import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsUnique } from '@/common/decorators/staff';
import { StaffRole } from '@/enums';

export class CreateStaffDto {
  @IsNotEmpty()
  @IsString()
  @IsUnique('username', { message: 'Username already exists' })
  username: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  @IsUnique('email', { message: 'Email already exists' })
  email: string;

  @IsString()
  @IsNotEmpty()
  // @IsStrongPassword()
  password: string;

  @IsString()
  @IsEnum(StaffRole)
  role: StaffRole;

  @IsString()
  @IsOptional()
  branch: string;
}
