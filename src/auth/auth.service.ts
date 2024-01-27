import { Injectable } from '@nestjs/common';
import { LoginDto, PasswordChangeDto } from '@/auth/dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResponseLoginDto } from '@/auth/dto/response-login.dto';
import { Staff } from '@/models/staff/schemas/staff.schema';
import * as bcrypt from 'bcrypt';
import { RequestUser } from '@/interfaces';
import { ResponseStaffDto } from '@/models/staff/dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Staff.name) private staffModel: Model<Staff>,
    private jwtService: JwtService,
  ) {}

  ////////// Auth for staff //////////
  async loginStaff(loginDto: LoginDto) {
    const staff = await this.staffModel
      .findOne({
        username: loginDto.username,
      })
      .select('username fullName role password')
      .lean()
      .exec();

    if (!staff) throw new Error('Invalid username or password');

    const isPasswordCorrect = await bcrypt.compare(
      loginDto.password,
      staff.password,
    );

    if (!isPasswordCorrect) throw new Error('Invalid username or password');

    const payload: Partial<RequestUser> = {
      id: staff._id.toString(),
      username: staff.username,
      fullName: staff.fullName,
      role: staff.role,
    };

    const token = await this.jwtService.signAsync(payload);

    return new ResponseLoginDto({
      ...staff,
      accessToken: 'Bearer ' + token,
    });
  }

  async getStaffInfo(requestUser: RequestUser) {
    const staff = await this.staffModel.findById(requestUser.id).lean().exec();

    if (!staff) throw new Error('Account not found');

    return new ResponseStaffDto(staff);
  }

  async changeStaffPassword(
    passwordChangeDto: PasswordChangeDto,
    requestUser: RequestUser,
  ) {
    const staff = await this.staffModel.findById(requestUser.id).exec();
    if (!staff) throw new Error('Account not found');

    const isPasswordCorrect = await bcrypt.compare(
      passwordChangeDto.oldPassword,
      staff.password,
    );
    if (!isPasswordCorrect) throw new Error('Incorrect password');

    staff.password = passwordChangeDto.newPassword;
    staff.updatedBy = requestUser.fullName;
    staff.updatedAt = new Date();

    return staff.save();
  }

  async resetStaffPassword() {
    return 'staff password reset in progress';
  }

  ////////// Auth for customer //////////
  async loginCustomer() {
    return 'customer login in progress';
  }

  async registerCustomer() {
    return 'customer register in progress';
  }

  async getCustomerInfo() {
    return 'customer info in progress';
  }

  async changeCustomerPassword() {
    return 'customer password change in progress';
  }

  async resetCustomerPassword() {
    return 'customer password reset in progress';
  }
}
