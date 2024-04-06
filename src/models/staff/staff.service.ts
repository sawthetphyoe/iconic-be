import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';
import { CreateStaffDto, ResponseStaffDto, UpdateStaffDto } from './dto';
import { UserRole } from '@/enums/UserRole';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { Pageable } from '@/interfaces';
import { Staff } from '@/models/staff/schemas/staff.schema';
import { SYSTEM } from '@/common/constants';
import { Branch } from '@/models/branches/schemas/branch.schema';
import { ResponseBranchDto } from '@/models/branches/dto/response-branch.dto';

@Injectable()
export class StaffService {
  constructor(
    @InjectModel(Staff.name) private staffModel: Model<Staff>,
    @InjectModel(Branch.name) private branchModel: Model<Branch>,
  ) {}

  getRoles() {
    return [
      {
        displayName: 'Super Admin',
        name: UserRole.SUPER_ADMIN,
      },
      {
        displayName: 'Admin',
        name: UserRole.ADMIN,
      },
    ];
  }

  async create(createStaffDto: CreateStaffDto, createdBy?: string) {
    const newStaff = new this.staffModel({
      ...createStaffDto,
      password: 'password',
      createdBy: createdBy || SYSTEM,
    });

    if (!newStaff) throw new Error('Staff create failed');

    if (createStaffDto.branch)
      await this.updateStaffCountForBranch(createStaffDto.branch, 'inc');

    await newStaff.save();

    return newStaff;
  }

  async findAll(query: ExpressQuery): Promise<Pageable<ResponseStaffDto>> {
    const filter = {
      ...(query.username && {
        username: { $regex: query.username, $options: 'i' },
      }),
      ...(query.fullName && {
        fullName: { $regex: query.fullName, $options: 'i' },
      }),
      ...(query.email && { email: { $regex: query.email, $options: 'i' } }),
      ...(query.branch && { branch: query.branch }),
      ...(query.role && { role: query.role }),
    };

    const currentPage = parseInt(query.page as string) || 1;
    const currentSize = parseInt(query.size as string) || 10;

    const totalRecord = await this.staffModel
      .countDocuments({ ...filter })
      .exec();
    const totalPage = Math.ceil(totalRecord / currentSize);

    const sort = (query.sort as string) || 'createdAt';
    const order = (query.order as SortOrder) || 'asc';
    const skip = (currentPage - 1) * currentSize;

    const list = await this.staffModel
      .find({ ...filter })
      .limit(currentSize)
      .skip(skip)
      .sort({ [sort]: order })
      .populate('branch')
      .lean()
      .exec();

    if (!list) throw new Error('Staffs not found');

    const dtoList = list.map((staff) => {
      return new ResponseStaffDto(staff);
    });

    return {
      currentPage,
      currentSize,
      totalRecord,
      totalPage,
      dtoList,
    };
  }

  async findOne(id: string) {
    const staff = await this.staffModel
      .findById(id)
      .populate('branch')
      .lean()
      .exec();

    if (!staff) throw new Error('Staff not found');

    return new ResponseStaffDto(staff);
  }

  async update(id: string, updateStaffDto: UpdateStaffDto, updatedBy?: string) {
    if (updateStaffDto.branch) {
      const staff = await this.staffModel
        .findById(id)
        .select('branch')
        .lean()
        .exec();

      if (!staff) throw new Error('Staff not found');

      const staffDto = new ResponseStaffDto(staff);
      const oldBranchId = staffDto.branch?._id.toString();
      const newBranchId = updateStaffDto.branch;

      const isNewBranchAdded = !!newBranchId;

      const isOldBranchChanged = !!(
        oldBranchId &&
        newBranchId &&
        oldBranchId !== newBranchId
      );

      if (isNewBranchAdded) {
        const updatedNewBranch = await this.updateStaffCountForBranch(
          newBranchId,
          'inc',
        );
        if (!updatedNewBranch) throw new Error('Branch not found');
      }

      if (isOldBranchChanged) {
        const updatedOldBranch = await this.updateStaffCountForBranch(
          oldBranchId,
          'dec',
        );
        if (!updatedOldBranch) throw new Error('Branch not found');
      }
    }

    const updatedStaff = await this.staffModel
      .findByIdAndUpdate(
        id,
        { ...updateStaffDto, updatedBy, updatedAt: new Date() },
        { new: true },
      )
      .populate('branch')
      .lean()
      .exec();

    if (!updatedStaff) throw new Error('Staff not found');

    return new ResponseStaffDto(updatedStaff);
  }

  async remove(id: string) {
    const deletedStaff = await this.staffModel
      .findByIdAndDelete({ _id: id })
      .lean()
      .exec();

    if (!deletedStaff) throw new Error('Staff not found');

    if (deletedStaff.branch)
      await this.updateStaffCountForBranch(
        new ResponseStaffDto(deletedStaff).branch._id.toString(),
        'dec',
      );

    return new ResponseStaffDto(deletedStaff);
  }

  async updateStaffCountForBranch(branchId: string, action: 'inc' | 'dec') {
    const updatedBranch = await this.branchModel
      .findByIdAndUpdate(
        branchId,
        {
          updatedAt: new Date(),
          updatedBy: SYSTEM,
          $inc: { staffCount: action === 'inc' ? 1 : -1 },
        },
        { new: true },
      )
      .lean()
      .exec();

    if (!updatedBranch) throw new Error('Branch not found');

    return new ResponseBranchDto(updatedBranch);
  }
}
