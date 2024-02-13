import { Module } from '@nestjs/common';
import { ProductFaqsService } from './product-faqs.service';
import { ProductFaqsController } from './product-faqs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductFaq, ProductFaqSchema } from '@/models/product-faqs/schemas/product-faq.schema';
import { Product, ProductSchema } from '@/models/products/schemas/product.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
      {
        name: ProductFaq.name,
        schema: ProductFaqSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema,
      },
    ]),
  ],
  controllers: [ProductFaqsController],
  providers: [ProductFaqsService],
})
export class ProductFaqsModule {}
