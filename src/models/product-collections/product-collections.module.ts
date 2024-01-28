import { Module } from '@nestjs/common';
import { ProductCollectionsService } from './product-collections.service';
import { ProductCollectionsController } from './product-collections.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProductCollection,
  ProductCollectionSchema,
} from '@/models/product-collections/schemas/product-collection.schema';
import { ProductTypesModule } from '@/models/product-types/product-types.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ProductCollection.name,
        schema: ProductCollectionSchema,
      },
    ]),
    ProductTypesModule,
  ],
  controllers: [ProductCollectionsController],
  providers: [ProductCollectionsService],
})
export class ProductCollectionsModule {}
