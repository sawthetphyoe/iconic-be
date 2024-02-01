import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Product,
  ProductSchema,
} from '@/models/products/schemas/product.schema';
import {
  ProductType,
  ProductTypeSchema,
} from '@/models/product-types/schemas/product-type.schema';
import { UniqueProductValidator } from '@/common/decorators';
import { DoSpacesServiceProvider } from '@/doSpaces/doSpaces.provider';
import { DoSpacesService } from '@/doSpaces/doSpace.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: ProductType.name,
        schema: ProductTypeSchema,
      },
    ]),
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    UniqueProductValidator,
    DoSpacesServiceProvider,
    DoSpacesService,
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
