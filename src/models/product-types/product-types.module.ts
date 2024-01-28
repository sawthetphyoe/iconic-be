import { Module } from '@nestjs/common';
import { ProductTypesService } from './product-types.service';
import { ProductTypesController } from './product-types.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProductType,
  ProductTypeSchema,
} from '@/models/product-types/schemas/product-type.schema';
import {
  ProductCollection,
  ProductCollectionSchema,
} from '@/models/product-collections/schemas/product-collection.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ProductType.name,
        schema: ProductTypeSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: ProductCollection.name,
        schema: ProductCollectionSchema,
      },
    ]),
  ],
  controllers: [ProductTypesController],
  providers: [ProductTypesService],
  exports: [ProductTypesService],
})
export class ProductTypesModule {}
