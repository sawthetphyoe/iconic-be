import { Injectable } from '@nestjs/common';
import { LoginDto, PasswordResetDto } from '@/auth/dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as jwt from 'jsonwebtoken';
import { LoginResponseDto } from '@/auth/dto/login-response.dto';
import { Staff } from '@/models/staff/schemas/staff.schema';
import * as bcrypt from 'bcrypt';

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

    return new LoginResponseDto({
      ...staff,
      accessToken: 'Bearer ' + token,
    });
  }

  me() {
    return 'me';
  }

  resetPassword(passwordResetDto: PasswordResetDto) {
    return 'reset-password';
  }
}
