import { Module } from '@nestjs/common';
import { ReportsController } from '@/reports/reports.controller';
import { ReportsService } from '@/reports/reports.service';
import { OrdersModule } from '@/models/orders/orders.module';
import { CustomersModule } from '@/models/customers/customers.module';

@Module({
  imports: [OrdersModule, CustomersModule],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [],
})
export class ReportsModule {}
