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

  async loginCustomer() {
    return 'customer login in progress';
  }

  async getMe(requestUser: RequestUser) {
    // TODO: If request user has no role, find in customer models and return customer info
    if (!requestUser.role) return;

    const staff = await this.staffModel.findById(requestUser.id).lean().exec();

    if (!staff) return;

    return new ResponseStaffDto(staff);
  }

  async changePassword(
    passwordChangeDto: PasswordChangeDto,
    requestUser: RequestUser,
  ) {
    // TODO: If request user has no role, find in customer models and change password
    // if (!requestUser.role) return;

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
