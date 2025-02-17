import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StaffModule } from '@/models/staff/staff.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { BranchesModule } from '@/models/branches/branches.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import * as process from 'process';
import { AuthGuard, RolesGuard } from '@/guards';
import { ProductTypesModule } from '@/models/product-types/product-types.module';
import { ProductsModule } from '@/models/products/products.module';
import { SpacesModule } from '@/doSpaces/spaces.module';
import { ProductFaqsModule } from './models/product-faqs/product-faqs.module';
import { InventoriesModule } from '@/models/inventories/inventories.module';
import { ProductVariantsModule } from './models/product-variants/product-variants.module';
import { MemberTypesModule } from '@/models/member-types/member-types.module';
import { PaymentTypesModule } from '@/models/payment-types/payment-types.module';
import { CustomersModule } from '@/models/customers/customers.module';
import { OrdersModule } from '@/models/orders/orders.module';
import { ReportsService } from './reports/reports.service';
import { ReportsController } from './reports/reports.controller';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.DATABASE_HOST || 'mongodb://localhost:27017',
    ),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '1h' },
    }),
    StaffModule,
    AuthModule,
    BranchesModule,
    ProductTypesModule,
    ProductsModule,
    SpacesModule,
    ProductFaqsModule,
    InventoriesModule,
    ProductVariantsModule,
    MemberTypesModule,
    PaymentTypesModule,
    CustomersModule,
    OrdersModule,
    ReportsModule,
  ],
  controllers: [AuthController, ReportsController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AuthService,
    ReportsService,
  ],
})
export class AppModule {}
