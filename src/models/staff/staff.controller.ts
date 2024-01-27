import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { StaffService } from './staff.service';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { CreateStaffDto, ResponseStaffDto, UpdateStaffDto } from './dto';
import mongoose from 'mongoose';
import { Pageable, RequestUser, MutationSuccessResponse } from '@/interfaces';
import { Roles, User } from '@/common/decorators';
import { UserRole } from '@/enums';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get('roles')
  getRoles() {
    return this.staffService.getRoles();
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createStaffDto: CreateStaffDto,
    @User() user: RequestUser,
  ) {
    try {
      const staff = await this.staffService.create(
        createStaffDto,
        user?.fullName,
      );
      return {
        id: staff._id.toString(),
        message: 'Staff created successfully',
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  findAll(@Query() query: ExpressQuery): Promise<Pageable<ResponseStaffDto>> {
    try {
      return this.staffService.findAll(query);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ResponseStaffDto> {
    const isIdValid = mongoose.Types.ObjectId.isValid(id);
    if (!isIdValid)
      throw new HttpException('Staff not found', HttpStatus.NOT_FOUND);

    try {
      return await this.staffService.findOne(id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateStaffDto: UpdateStaffDto,
    @User() user: RequestUser,
  ): Promise<MutationSuccessResponse> {
    const isIdValid = mongoose.Types.ObjectId.isValid(id);
    if (!isIdValid)
      throw new HttpException('Staff not found', HttpStatus.NOT_FOUND);

    try {
      await this.staffService.update(id, updateStaffDto, user.fullName);
      return {
        id,
        message: 'Staff updated successfully',
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  async remove(@Param('id') id: string): Promise<MutationSuccessResponse> {
    const isIdValid = mongoose.Types.ObjectId.isValid(id);
    if (!isIdValid)
      throw new HttpException('Staff not found', HttpStatus.NOT_FOUND);

    try {
      await this.staffService.remove(id);
      return {
        message: 'Staff deleted successfully',
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
