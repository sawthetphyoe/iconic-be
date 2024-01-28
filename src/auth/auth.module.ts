import { Module } from '@nestjs/common';
import { AuthController } from '@/auth/auth.controller';
import { AuthService } from '@/auth/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Staff, StaffSchema } from '@/models/staff/schemas/staff.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Staff.name,
        schema: StaffSchema,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
