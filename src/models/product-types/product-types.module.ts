import { Module } from '@nestjs/common';
import { ProductTypesService } from './product-types.service';
import { ProductTypesController } from './product-types.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProductType,
  ProductTypeSchema,
} from '@/models/product-types/schemas/product-type.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ProductType.name,
        schema: ProductTypeSchema,
      },
    ]),
  ],
  controllers: [ProductTypesController],
  providers: [ProductTypesService],
})
export class ProductTypesModule {}
