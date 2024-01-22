import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StaffModule } from '@/staff/staff.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://sawthetphyoe28498:SDQzhH02fpUPyaAg@cluster0.qf4h6ye.mongodb.net/iconic',
    ),
    StaffModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
