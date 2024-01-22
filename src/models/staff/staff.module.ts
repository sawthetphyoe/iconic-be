import { Module } from '@nestjs/common';
import { StaffService } from '@/models/staff/staff.service';
import { StaffController } from '@/models/staff/staff.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Staff, StaffSchema } from '@/models/staff/schemas/staff.schema';
import { IsUniqueConstraint } from '@/common/decorators/staff/IsUnique';
import * as bcrypt from 'bcrypt';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Staff.name,
        schema: StaffSchema,
      },
    ]),
  ],
  controllers: [StaffController],
  providers: [StaffService, IsUniqueConstraint],
})
export class StaffModule {}
