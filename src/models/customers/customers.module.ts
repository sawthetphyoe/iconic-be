import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Customer,
  CustomerSchema,
} from '@/models/customers/schemas/customer.schema';
import {
  MemberType,
  MemberTypeSchema,
} from '@/models/member-types/schemas/member-type.schema';

@Module({
  imports: [
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
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [
    MongooseModule.forFeature([
      {
        name: Customer.name,
        schema: CustomerSchema,
      },
    ]),
    CustomersService,
  ],
})
export class CustomersModule {}
