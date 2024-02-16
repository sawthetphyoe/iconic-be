import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Inventory,
  InventorySchema,
} from '@/models/inventory/schemas/inventory.schema';
import { Branch, BranchSchema } from '@/models/branches/schemas/branch.schema';
import {
  ProductVariant,
  ProductVariantSchema,
} from '@/models/product-variants/schemas/product-variant.schema';
import { ProductVariantsModule } from '@/models/product-variants/product-variants.module';

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
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoryModule {}
