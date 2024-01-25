import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StaffModule } from '@/models/staff/staff.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from '@/guards';
import { UserInterceptor } from '@/helpers/interceptors';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://sawthetphyoe28498:SDQzhH02fpUPyaAg@cluster0.qf4h6ye.mongodb.net/iconic\n',
    ),
    StaffModule,
    AuthModule,
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: UserInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AuthService,
  ],
})
export class AppModule {}
