import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { LoginDto, PasswordResetDto } from '@/auth/dto';
import { ResponseLoginDto } from '@/auth/dto/response-login.dto';
import { User } from '@/common/decorators';
import { RequestUser } from '@/interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<ResponseLoginDto> {
    const staff = await this.authService.login(loginDto);
    if (!staff) throw new HttpException('Invalid username or password', 400);

    return staff;
  }

  @Get('me')
  me(@User() user: RequestUser) {
    if (!user) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    return this.authService.me(user);
  }

  @Post('reset-password')
  resetPassword(@Body() passwordResetDto: PasswordResetDto) {
    return this.authService.resetPassword(passwordResetDto);
  }
}
