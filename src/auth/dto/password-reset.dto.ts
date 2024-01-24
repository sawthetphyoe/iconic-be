import { IsNotEmpty, IsString } from 'class-validator';
import { IsPasswordMatch } from '@/common/decorators';

export class PasswordResetDto {
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  @IsPasswordMatch('newPassword', { message: 'Passwords do not match' })
  confirmPassword: string;
}
