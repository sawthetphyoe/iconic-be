import { Injectable } from '@nestjs/common';
import { CreateBranchDto, UpdateBranchDto } from '@/models/branches/dto';
import { InjectModel } from '@nestjs/mongoose';
import { Branch } from '@/models/branches/schemas/branch.schema';
import { Model } from 'mongoose';
import { ResponseBranchDto } from '@/models/branches/dto/response-branch.dto';

@Injectable()
export class BranchesService {
  constructor(@InjectModel(Branch.name) private branchModel: Model<Branch>) {}

  create(createBranchDto: CreateBranchDto, createdBy: string) {
    const newBranch = new this.branchModel({ ...createBranchDto, createdBy });

    if (!newBranch) throw new Error('Branch create failed');

    return newBranch.save();
  }

  async findAll() {
    const branches = await this.branchModel.find().lean().exec();

    if (!branches) throw new Error('Branches not found');

    return branches.map((branch) => new ResponseBranchDto(branch));
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

    if (branch.staffCount > 0) throw new Error('Branch has staffs');

    const deletedBranch = await this.branchModel
      .findByIdAndDelete(id)
      .lean()
      .exec();

    if (!deletedBranch) throw new Error('Branch not found');

    return new ResponseBranchDto(deletedBranch);
  }
}
