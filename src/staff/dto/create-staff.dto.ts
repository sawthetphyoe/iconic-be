import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { IsUnique } from '@/lib/decorators/staff';
import { StaffRole } from '@/lib/enums';

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
  @IsNotEmpty()
  branch: string;
}
