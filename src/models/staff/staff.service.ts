import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';
import { CreateStaffDto, ResponseStaffDto, UpdateStaffDto } from './dto';
import { UserRole } from '@/enums/UserRole';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { Pageable } from '@/interfaces';
import { Staff } from '@/models/staff/schemas/staff.schema';

@Injectable()
export class StaffService {
  constructor(@InjectModel(Staff.name) private staffModel: Model<Staff>) {}

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
      createdBy: createdBy || 'Developer',
    });

    return newStaff.save();
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
      ...(query.branch && { branch: { $regex: query.branch, $options: 'i' } }),
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
      .lean()
      .exec();

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
    const staff = await this.staffModel.findById(id).lean().exec();

    if (!staff) return;

    return new ResponseStaffDto(staff);
  }

  async update(id: string, updateStaffDto: UpdateStaffDto, updatedBy?: string) {
    const staff = await this.staffModel
      .findByIdAndUpdate(
        id,
        { ...updateStaffDto, updatedBy, updatedAt: new Date() },
        { new: true },
      )
      .lean()
      .exec();

    if (!staff) return;

    return new ResponseStaffDto(staff);
  }

  async remove(id: string) {
    return await this.staffModel.findByIdAndDelete({ _id: id }).lean().exec();
  }
}
