import { Module } from '@nestjs/common';
import { ProductCollectionsService } from './product-collections.service';
import { ProductCollectionsController } from './product-collections.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProductCollection,
  ProductCollectionSchema,
} from '@/models/product-collections/schemas/product-collection.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ProductCollection.name,
        schema: ProductCollectionSchema,
      },
    ]),
  ],
  controllers: [ProductCollectionsController],
  providers: [ProductCollectionsService],
})
export class ProductCollectionsModule {}
