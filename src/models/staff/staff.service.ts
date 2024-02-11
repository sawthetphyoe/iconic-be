import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';
import { CreateStaffDto, ResponseStaffDto, UpdateStaffDto } from './dto';
import { UserRole } from '@/enums/UserRole';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { Pageable } from '@/interfaces';
import { Staff } from '@/models/staff/schemas/staff.schema';
import { SYSTEM } from '@/common/constants';
import { BranchesService } from '@/models/branches/branches.service';

@Injectable()
export class StaffService {
  constructor(
    @InjectModel(Staff.name) private staffModel: Model<Staff>,
    private readonly branchesService: BranchesService,
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
      createdBy: createdBy || SYSTEM,
    });

    if (!newStaff) throw new Error('Staff create failed');

    if (createStaffDto.branch)
      await this.branchesService.updateStaffCount(createStaffDto.branch, 'inc');

    await newStaff.save();

    return newStaff;
  }

  async findAll(query: ExpressQuery): Promise<Pageable> {
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

    const sort = (query.sort as string) || 'created_at';
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
      await this.branchesService.updateStaffCount(updateStaffDto.branch, 'inc');

      const staff = await this.staffModel
        .findById(id)
        .select('branch')
        .lean()
        .exec();

      if (!staff) throw new Error('Staff not found');

      const staffDto = new ResponseStaffDto(staff);
      const oldBranchId = staffDto.branch?._id.toString();
      const newBranchId = updateStaffDto.branch;

      if (oldBranchId && oldBranchId !== newBranchId) {
        await this.branchesService.updateStaffCount(
          staffDto.branch._id.toString(),
          'dec',
        );
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
      await this.branchesService.updateStaffCount(
        new ResponseStaffDto(deletedStaff).branch._id.toString(),
        'dec',
      );

    return new ResponseStaffDto(deletedStaff);
  }
}
