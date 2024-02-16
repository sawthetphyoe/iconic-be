import { Module } from '@nestjs/common';
import { ProductVariantsService } from './product-variants.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductVariant, ProductVariantSchema } from '@/models/product-variants/schemas/product-variant.schemas';
import { Product, ProductSchema } from '@/models/products/schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: ProductVariant.name,
      schema: ProductVariantSchema,
    }]),
    MongooseModule.forFeature([{
      name:Product.name,
      schema: ProductSchema,
    }]),
  ],
  controllers: [],
  providers: [ProductVariantsService],
  exports: [ProductVariantsService],
})
export class ProductVariantsModule {}
