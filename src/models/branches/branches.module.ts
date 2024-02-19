import { Module } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { BranchesController } from './branches.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Branch, BranchSchema } from '@/models/branches/schemas/branch.schema';
import { InventoriesModule } from '@/models/inventories/inventories.module';
import { StaffModule } from '@/models/staff/staff.module';

@Module({
  imports: [
    InventoriesModule,
    StaffModule,
    MongooseModule.forFeature([
      {
        name: Branch.name,
        schema: BranchSchema,
      },
    ]),
  ],
  controllers: [BranchesController],
  providers: [BranchesService],
  exports: [BranchesService],
})
export class BranchesModule {}
