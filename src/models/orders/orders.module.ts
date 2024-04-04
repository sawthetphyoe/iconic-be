import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from '@/models/orders/schemas/order.schema';
import {
  OrderDetails,
  OrderDetailsSchema,
} from '@/models/orders/schemas/order-details.schema';
import { ProductVariantsModule } from '@/models/product-variants/product-variants.module';
import { InventoriesModule } from '@/models/inventories/inventories.module';
import { CustomersModule } from '@/models/customers/customers.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Order.name,
        schema: OrderSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: OrderDetails.name,
        schema: OrderDetailsSchema,
      },
    ]),
    ProductVariantsModule,
    InventoriesModule,
    CustomersModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
