import { Injectable } from '@nestjs/common';
import { LoginDto, PasswordResetDto } from '@/auth/dto';
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

  async login(loginDto: LoginDto) {
    const staff = await this.staffModel
      .findOne({
        username: loginDto.username,
      })
      .select('username fullName role password')
      .lean()
      .exec();

    if (!staff) return;

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      staff.password,
    );

    if (!isPasswordValid) return;

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

  async me(user: RequestUser) {
    // TODO: If user does not have role, find in customer collection and return customer info
    if (!user.role) return;

    const staff = await this.staffModel.findById(user.id).lean().exec();

    if (!staff) return;

    return new ResponseStaffDto(staff);
  }

  resetPassword(passwordResetDto: PasswordResetDto) {
    return 'reset-password';
  }
}
