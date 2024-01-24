import { Body, Controller, Get, HttpException, Post } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { LoginDto, PasswordResetDto } from '@/auth/dto';
import { LoginResponseDto } from '@/auth/dto/login-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    const staff = await this.authService.login(loginDto);
    if (!staff) throw new HttpException('Invalid username or password', 400);

    return staff;
  }

  @Get('me')
  me() {
    return this.authService.me();
  }

  @Post('reset-password')
  resetPassword(@Body() passwordResetDto: PasswordResetDto) {
    return this.authService.resetPassword(passwordResetDto);
  }
}
