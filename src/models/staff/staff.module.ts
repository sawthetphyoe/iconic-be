import { Module } from '@nestjs/common';
import { StaffService } from '@/models/staff/staff.service';
import { StaffController } from '@/models/staff/staff.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Staff, StaffSchema } from '@/models/staff/schemas/staff.schema';
import { UniqueStaffValidator } from '@/common/decorators/staff/IsUnique';

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
  providers: [StaffService, UniqueStaffValidator],
})
export class StaffModule {}
