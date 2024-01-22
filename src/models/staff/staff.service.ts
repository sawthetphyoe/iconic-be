import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Staff } from '@/models/staff/schemas/staff.schema';
import { Model, SortOrder } from 'mongoose';
import { CreateStaffDto, UpdateStaffDto } from './dto';
import { StaffRole } from '@/enums/StaffRole';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { Pageable } from '@/interfaces';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StaffService {
  constructor(@InjectModel(Staff.name) private staffModel: Model<Staff>) {}

  getRoles() {
    return [
      {
        displayName: 'Super Admin',
        name: StaffRole.SUPER_ADMIN,
      },
      {
        displayName: 'Admin',
        name: StaffRole.ADMIN,
      },
    ];
  }

  async create(createStaffDto: CreateStaffDto) {
    const newStaff = new this.staffModel(createStaffDto);

    return newStaff.save();
  }

  async findAll(query: ExpressQuery): Promise<Pageable> {
    const filter = {
      ...(query.username && {
        role: { $regex: query.username, $options: 'i' },
      }),
      ...(query.fullName && {
        role: { $regex: query.fullName, $options: 'i' },
      }),
      ...(query.email && { role: { $regex: query.email, $options: 'i' } }),
      ...(query.branch && { role: { $regex: query.branch, $options: 'i' } }),
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
    const dtoList = await this.staffModel
      .find({ ...filter })
      .limit(currentSize)
      .skip(skip)
      .sort({ [sort]: order })
      .exec();

    return {
      currentPage,
      currentSize,
      totalRecord,
      totalPage,
      dtoList,
    };
  }

  findOne(id: string) {
    return this.staffModel.findById(id);
  }

  update(id: string, updateStaffDto: UpdateStaffDto) {
    return this.staffModel.findByIdAndUpdate(
      id,
      {
        fullName: updateStaffDto.fullName,
        role: updateStaffDto.role,
        branch: updateStaffDto.branch,
        updated_by: 'Admin User', // TODO: Change to "current user"
        updated_at: new Date(),
      },
      { new: true },
    );
  }

  remove(id: string) {
    return this.staffModel.deleteOne({ _id: id });
  }
}
