import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StaffModule } from '@/models/staff/staff.module';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://sawthetphyoe28498:SDQzhH02fpUPyaAg@cluster0.qf4h6ye.mongodb.net/iconic',
    ),
    StaffModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
