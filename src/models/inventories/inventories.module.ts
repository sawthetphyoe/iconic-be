import { Module } from '@nestjs/common';
import { InventoriesService } from './inventories.service';
import { InventoriesController } from './inventories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Inventory,
  InventorySchema,
} from '@/models/inventories/schemas/inventory.schema';
import { Branch, BranchSchema } from '@/models/branches/schemas/branch.schema';
import {
  ProductVariant,
  ProductVariantSchema,
} from '@/models/product-variants/schemas/product-variant.schema';
import { ProductVariantsModule } from '@/models/product-variants/product-variants.module';
import {
  Product,
  ProductSchema,
} from '@/models/products/schemas/product.schema';

@Module({
  imports: [
    ProductVariantsModule,
    MongooseModule.forFeature([
      {
        name: Inventory.name,
        schema: InventorySchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: Branch.name,
        schema: BranchSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: ProductVariant.name,
        schema: ProductVariantSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema,
      },
    ]),
  ],
  controllers: [InventoriesController],
  providers: [InventoriesService],
  exports: [InventoriesService],
})
export class InventoriesModule {}
