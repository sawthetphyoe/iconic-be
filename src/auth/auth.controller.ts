import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { LoginDto, PasswordChangeDto } from '@/auth/dto';
import { ResponseLoginDto } from '@/auth/dto/response-login.dto';
import { Public, Roles, User } from '@/common/decorators';
import { MutationSuccessResponse, RequestUser } from '@/interfaces';
import { UserRole } from '@/enums';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  ////////// Staff auth controllers //////////
  @Public()
  @Post('staff/login')
  async loginStaff(@Body() loginDto: LoginDto): Promise<ResponseLoginDto> {
    try {
      return await this.authService.loginStaff(loginDto);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('staff/me')
  async getStaffInfo(@User() user: RequestUser) {
    try {
      return await this.authService.getStaffInfo(user);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }

  @Patch('staff/change-password')
  async changeStaffPassword(
    @Body() passwordChangeDto: PasswordChangeDto,
    @User() user: RequestUser,
  ): Promise<MutationSuccessResponse> {
    try {
      await this.authService.changeStaffPassword(passwordChangeDto, user);
      return {
        id: user.id,
        message: 'Password changed successfully',
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Roles(UserRole.SUPER_ADMIN)
  @Patch('staff/reset-password')
  async resetStaffPassword() {
    return this.authService.resetStaffPassword();
  }

  ////////// Customer auth controllers //////////
  @Public()
  @Post('customer/register')
  async registerCustomer() {
    return this.authService.registerCustomer();
  }

  @Public()
  @Post('customer/login')
  async loginCustomer() {
    return this.authService.loginCustomer();
  }

  @Get('customer/me')
  getCustomerInfo() {
    return this.authService.getCustomerInfo();
  }

  @Patch('customer/change-password')
  changeCustomerPassword() {
    return this.authService.changeCustomerPassword();
  }

  @Roles(UserRole.SUPER_ADMIN)
  @Patch('customer/reset-password')
  resetCustomerPassword() {
    return this.authService.resetCustomerPassword();
  }
}
