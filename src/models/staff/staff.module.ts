import { Module } from '@nestjs/common';
import { StaffService } from '@/models/staff/staff.service';
import { StaffController } from '@/models/staff/staff.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Staff, StaffSchema } from '@/models/staff/schemas/staff.schema';
import { UniqueStaffValidator } from '@/common/decorators/validation/IsUniqueStaff';
import { Branch, BranchSchema } from '@/models/branches/schemas/branch.schema';

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
        name: Branch.name,
        schema: BranchSchema,
      },
    ]),
  ],
  controllers: [StaffController],
  providers: [StaffService, UniqueStaffValidator],
  exports: [
    MongooseModule.forFeature([
      {
        name: Staff.name,
        schema: StaffSchema,
      },
    ]),
  ],
})
export class StaffModule {}
