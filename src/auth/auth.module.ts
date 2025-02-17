import { Module } from '@nestjs/common';
import { AuthController } from '@/auth/auth.controller';
import { AuthService } from '@/auth/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Staff, StaffSchema } from '@/models/staff/schemas/staff.schema';
import {
  Customer,
  CustomerSchema,
} from '@/models/customers/schemas/customer.schema';
import { MemberTypesService } from '@/models/member-types/member-types.service';
import {
  MemberType,
  MemberTypeSchema,
} from '@/models/member-types/schemas/member-type.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Staff.name,
        schema: StaffSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: Customer.name,
        schema: CustomerSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: MemberType.name,
        schema: MemberTypeSchema,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
