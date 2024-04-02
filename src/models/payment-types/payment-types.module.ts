import { Module } from '@nestjs/common';
import { PaymentTypesService } from './payment-types.service';
import { PaymentTypesController } from './payment-types.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PaymentType,
  PaymentTypeSchema,
} from '@/models/payment-types/schemas/payment-type.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: PaymentType.name,
        schema: PaymentTypeSchema,
      },
    ]),
  ],
  controllers: [PaymentTypesController],
  providers: [PaymentTypesService],
})
export class PaymentTypesModule {}
