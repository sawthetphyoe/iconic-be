import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto, PasswordChangeDto } from '@/auth/dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as jwt from 'jsonwebtoken';
import { ResponseLoginDto } from '@/auth/dto/response-login.dto';
import { Staff } from '@/models/staff/schemas/staff.schema';
import * as bcrypt from 'bcrypt';
import { RequestUser } from '@/interfaces';
import { ResponseStaffDto } from '@/models/staff/dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(Staff.name) private staffModel: Model<Staff>) {}

  async loginStaff(loginDto: LoginDto) {
    const staff = await this.staffModel
      .findOne({
        username: loginDto.username,
      })
      .select('username fullName role password')
      .lean()
      .exec();

    if (!staff) return;

    const isPasswordCorrect = await bcrypt.compare(
      loginDto.password,
      staff.password,
    );

    if (!isPasswordCorrect) return;

    const token = jwt.sign(
      {
        id: staff._id,
        username: staff.username,
        fullName: staff.fullName,
        role: staff.role,
      },
      'iconic-jwt-secret',
      {
        expiresIn: '1d',
      },
    );

    return new ResponseLoginDto({
      ...staff,
      accessToken: 'Bearer ' + token,
    });
  }

  async loginCustomer() {
    return 'customer login in progress';
  }

  async getMe(requestUser: RequestUser) {
    // TODO: If request user role is customer, find in customer models and return customer info
    if (!requestUser.role) return;

    const staff = await this.staffModel.findById(requestUser.id).lean().exec();

    if (!staff) return;

    return new ResponseStaffDto(staff);
  }

  async changePassword(
    passwordChangeDto: PasswordChangeDto,
    requestUser: RequestUser,
  ) {
    // TODO: If request user role is customer, find in customer models and update password
    if (!requestUser.role) return;

    const staff = await this.staffModel.findById(requestUser.id).exec();
    if (!staff) return;

    const isPasswordCorrect = await bcrypt.compare(
      passwordChangeDto.oldPassword,
      staff.password,
    );
    if (!isPasswordCorrect) return;

    staff.password = passwordChangeDto.newPassword;
    staff.updatedBy = requestUser.fullName;
    staff.updatedAt = new Date();

    return staff.save();
  }
}
