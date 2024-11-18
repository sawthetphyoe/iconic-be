import { AppwriteModule } from '@/appwrite/appwrite.module';
import { AppwriteService } from '@/appwrite/appwrite.service';
import { UniqueProductValidator } from '@/common/decorators';
import { DoSpacesService } from '@/doSpaces/doSpace.service';
import { DoSpacesServiceProvider } from '@/doSpaces/doSpaces.provider';
import { InventoriesModule } from '@/models/inventories/inventories.module';
import { ProductFaqsModule } from '@/models/product-faqs/product-faqs.module';
import {
  ProductType,
  ProductTypeSchema,
} from '@/models/product-types/schemas/product-type.schema';
import { ProductVariantsModule } from '@/models/product-variants/product-variants.module';
import {
  Product,
  ProductSchema,
} from '@/models/products/schemas/product.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

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
    ProductVariantsModule,
    ProductFaqsModule,
    InventoriesModule,
    AppwriteModule,
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    UniqueProductValidator,
    DoSpacesServiceProvider,
    DoSpacesService,
    AppwriteService,
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
