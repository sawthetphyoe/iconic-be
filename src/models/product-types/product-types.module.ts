import { Module } from '@nestjs/common';
import { ProductTypesService } from './product-types.service';
import { ProductTypesController } from './product-types.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProductType,
  ProductTypeSchema,
} from '@/models/product-types/schemas/product-type.schema';
import { ProductsModule } from '@/models/products/products.module';
import { UniqueProductTypeValidator } from '@/common/decorators';
import { ProductVariantsModule } from '@/models/product-variants/product-variants.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ProductType.name,
        schema: ProductTypeSchema,
      },
    ]),
    ProductsModule,
    ProductVariantsModule,
  ],
  controllers: [ProductTypesController],
  providers: [ProductTypesService, UniqueProductTypeValidator],
  exports: [
    MongooseModule.forFeature([
      {
        name: ProductType.name,
        schema: ProductTypeSchema,
      },
    ]),
    ProductsModule,
  ],
})
export class ProductTypesModule {}
