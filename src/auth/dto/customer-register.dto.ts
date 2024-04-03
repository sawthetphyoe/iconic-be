import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsPasswordMatch } from '@/common/decorators';

export class CustomerRegisterDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsPasswordMatch()
  passwordConfirm: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  address: string;
}
