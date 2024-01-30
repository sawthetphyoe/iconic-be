import { UserRole } from '@/enums';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  IsPasswordMatch,
  IsUniqueStaff as IsUnique,
} from '@/common/decorators';

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
  @IsNotEmpty()
  @IsPasswordMatch()
  passwordConfirm: string;

  @IsString()
  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  @IsOptional()
  branch: string;
}
