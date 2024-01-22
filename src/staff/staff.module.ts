import { Module } from '@nestjs/common';
import { StaffService } from '@/staff/staff.service';
import { StaffController } from '@/staff/staff.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Staff, StaffSchema } from '@/staff/entities/staff.entity';
import { IsUniqueConstraint } from '@/lib/decorators/staff/IsUnique';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Staff.name, schema: StaffSchema }]),
  ],
  controllers: [StaffController],
  providers: [StaffService, IsUniqueConstraint],
})
export class StaffModule {}
