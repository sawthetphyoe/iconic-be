import { Injectable } from '@nestjs/common';
import {
  CreateBranchDto,
  ResponseBranchDto,
  UpdateBranchDto,
} from '@/models/branches/dto';
import { InjectModel } from '@nestjs/mongoose';
import { Branch } from '@/models/branches/schemas/branch.schema';
import { Model } from 'mongoose';
import { InventoriesService } from '@/models/inventories/inventories.service';

@Injectable()
export class BranchesService {
  constructor(
    @InjectModel(Branch.name) private branchModel: Model<Branch>,
    private readonly inventoryService: InventoriesService,
  ) {}

  create(createBranchDto: CreateBranchDto, createdBy: string) {
    const newBranch = new this.branchModel({ ...createBranchDto, createdBy });

    if (!newBranch) throw new Error('Branch create failed');

    return newBranch.save();
  }

  async findAll() {
    const branches = await this.branchModel.find().lean().exec();

    if (!branches) throw new Error('Branches not found');

    const list = await this.inventoryService.findTotalQuantityForBranch();

    return branches
      .map((branch) => ({
        ...branch,
        itemCount:
          list.find((item) => item.branch.name === branch.name)?.quantity || 0,
      }))
      .map((branch) => new ResponseBranchDto(branch));
  }

  async findOne(id: string) {
    const branch = await this.branchModel.findById(id).lean().exec();

    if (!branch) throw new Error('Branch not found');

    return new ResponseBranchDto(branch);
  }

  async update(
    id: string,
    updateBranchDto: UpdateBranchDto,
    updatedBy: string,
  ) {
    const updatedBranch = await this.branchModel
      .findByIdAndUpdate(
        id,
        {
          ...updateBranchDto,
          updatedBy,
          updatedAt: new Date(),
        },
        { new: true },
      )
      .lean()
      .exec();

    if (!updatedBranch) throw new Error('Branch not found');

    return new ResponseBranchDto(updatedBranch);
  }

  async remove(id: string) {
    const branch = await this.branchModel.findById(id).lean().exec();
    if (!branch) return;

    if (branch.staffCount > 0)
      throw new Error(
        `Cannot delete branch. ${branch.staffCount} staff${branch.staffCount > 1 ? 's' : ''} assigned to this branch.`,
      );

    const inventories = await this.inventoryService.findAll({ branch: id });

    if (inventories && inventories.totalRecord > 0)
      throw new Error(
        `Cannot delete branch. ${inventories.totalRecord} product${inventories.totalRecord > 1 ? 's' : ''} assigned to this branch.`,
      );

    const deletedBranch = await this.branchModel
      .findByIdAndDelete(id)
      .lean()
      .exec();

    if (!deletedBranch) throw new Error('Branch not found');

    return new ResponseBranchDto(deletedBranch);
  }
}
