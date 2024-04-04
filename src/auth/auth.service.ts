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
import { Customer } from '@/models/customers/schemas/customer.schema';
import { CustomerRegisterDto } from '@/auth/dto/customer-register.dto';
import { MemberType } from '@/models/member-types/schemas/member-type.schema';
import { ResponseCustomerDto } from '@/models/customers/dto/response-customer.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Staff.name) private staffModel: Model<Staff>,
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
    @InjectModel(MemberType.name) private memberTypeModel: Model<MemberType>,
    private jwtService: JwtService,
  ) {}

  ////////// Auth for staff //////////
  async loginStaff(loginDto: LoginDto) {
    const staff = await this.staffModel
      .findOne({
        username: loginDto.username,
      })
      .select('username fullName role password email')
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
      email: staff.email,
    };

    const token = await this.jwtService.signAsync(payload);

    return new ResponseLoginDto({
      ...staff,
      accessToken: 'Bearer ' + token,
    });
  }

  async getStaffInfo(requestUser: RequestUser) {
    const staff = await this.staffModel
      .findById(requestUser.id)
      .populate('branch')
      .lean()
      .exec();

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
  async loginCustomer(loginDto: LoginDto) {
    const customer = await this.customerModel
      .findOne({
        email: loginDto.username,
      })
      .select('name email phone address password role')
      .lean()
      .exec();

    if (!customer) throw new Error('Invalid username or password');

    const isPasswordCorrect = await bcrypt.compare(
      loginDto.password,
      customer.password,
    );

    if (!isPasswordCorrect) throw new Error('Invalid username or password');

    const payload = {
      id: customer._id.toString(),
      name: customer.name,
      email: customer.email,
      role: customer.role,
    };

    const token = await this.jwtService.signAsync(payload);

    return new ResponseLoginDto({
      ...customer,
      accessToken: 'Bearer ' + token,
    });
  }

  async registerCustomer(customerRegisterDto: CustomerRegisterDto) {
    const memberType = await this.memberTypeModel
      .findOne({
        name: 'Bronze',
      })
      .lean()
      .exec();

    if (!memberType)
      throw new Error('Default member type not found for registration');

    const memberTypeId = memberType._id;

    const customer = new this.customerModel({
      ...customerRegisterDto,
      memberType: memberTypeId,
    });

    if (!customer) throw new Error('Registration failed');

    await customer.save();

    const customerObj = customer.toObject();

    const payload = {
      id: customer._id.toString(),
      name: customer.name,
      email: customer.email,
      role: customer.role,
    };

    const token = await this.jwtService.signAsync(payload);

    if (!token) throw new Error('Token generation failed');

    return new ResponseLoginDto({
      ...{ ...customerObj, memberType: customerObj.memberType.name },
      accessToken: 'Bearer ' + token,
    });
  }

  async getCustomerInfo(email: string) {
    const customer = await this.customerModel
      .findOne({ email })
      .populate('memberType')
      .lean()
      .exec();

    if (!customer) throw new Error('Customer not found');

    return new ResponseCustomerDto(customer);
  }

  async changeCustomerPassword() {
    return 'customer password change in progress';
  }

  async resetCustomerPassword() {
    return 'customer password reset in progress';
  }
}
