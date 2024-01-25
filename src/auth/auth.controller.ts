import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { LoginDto, PasswordChangeDto } from '@/auth/dto';
import { ResponseLoginDto } from '@/auth/dto/response-login.dto';
import { Public, User } from '@/common/decorators';
import { RequestUser, MutationSuccessResponse } from '@/interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login/staff')
  async loginStaff(@Body() loginDto: LoginDto): Promise<ResponseLoginDto> {
    const staff = await this.authService.loginStaff(loginDto);
    if (!staff) throw new HttpException('Invalid username or password', 400);

    return staff;
  }

  @Public()
  @Post('login/customer')
  async loginCustomer() {
    return this.authService.loginCustomer();
  }

  @Get('me')
  async getMe(@User() user: RequestUser) {
    const userInfo = await this.authService.getMe(user);
    if (!userInfo)
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
    return userInfo;
  }

  @Post('change-password')
  async changePassword(
    @Body() passwordChangeDto: PasswordChangeDto,
    @User() user: RequestUser,
  ): Promise<MutationSuccessResponse> {
    const changedUser = await this.authService.changePassword(
      passwordChangeDto,
      user,
    );

    if (!changedUser)
      throw new HttpException('Authorization failure', HttpStatus.UNAUTHORIZED);

    return {
      id: changedUser._id.toString(),
      message: 'Password changed successfully',
    };
  }
}
