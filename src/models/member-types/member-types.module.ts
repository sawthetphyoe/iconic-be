import { Module } from '@nestjs/common';
import { MemberTypesService } from './member-types.service';
import { MemberTypesController } from './member-types.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MemberType,
  MemberTypeSchema,
} from '@/models/member-types/schemas/member-type.schema';
import { CustomersModule } from '@/models/customers/customers.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MemberType.name,
        schema: MemberTypeSchema,
      },
    ]),
    CustomersModule,
  ],
  controllers: [MemberTypesController],
  providers: [MemberTypesService],
})
export class MemberTypesModule {}
