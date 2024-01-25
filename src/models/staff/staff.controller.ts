import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpCode,
  Query,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { StaffService } from './staff.service';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { CreateStaffDto, ResponseStaffDto, UpdateStaffDto } from './dto';
import mongoose from 'mongoose';
import { Pageable, RequestUser, SuccessResponse } from '@/interfaces';
import { UserRole } from '@/enums';
import { Roles, User } from '@/common/decorators';
import { AuthGuard } from '@/guards';

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
    const staff = await this.staffService.create(createStaffDto, user.fullName);

    return {
      id: staff._id.toString(),
      message: 'Staff created successfully',
    };
  }

  @Get()
  findAll(@Query() query: ExpressQuery): Promise<Pageable<ResponseStaffDto>> {
    return this.staffService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ResponseStaffDto> {
    const isIdValid = mongoose.Types.ObjectId.isValid(id);
    if (!isIdValid)
      throw new HttpException('Staff not found', HttpStatus.NOT_FOUND);

    const staff = await this.staffService.findOne(id);
    if (!staff)
      throw new HttpException('Staff not found', HttpStatus.NOT_FOUND);

    return staff;
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateStaffDto: UpdateStaffDto,
    @User() user: RequestUser,
  ): Promise<SuccessResponse> {
    const isIdValid = mongoose.Types.ObjectId.isValid(id);
    if (!isIdValid)
      throw new HttpException('Staff not found', HttpStatus.NOT_FOUND);

    const updatedStaff = await this.staffService.update(
      id,
      updateStaffDto,
      user.fullName,
    );
    if (!updatedStaff)
      throw new HttpException('Staff not found', HttpStatus.NOT_FOUND);

    return {
      id,
      message: 'Staff updated successfully',
    };
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  async remove(@Param('id') id: string): Promise<SuccessResponse> {
    const isIdValid = mongoose.Types.ObjectId.isValid(id);
    if (!isIdValid)
      throw new HttpException('Staff not found', HttpStatus.NOT_FOUND);

    const deletedStaff = await this.staffService.remove(id);
    if (!deletedStaff)
      throw new HttpException('Staff not found', HttpStatus.NOT_FOUND);

    return {
      message: 'Staff deleted successfully',
    };
  }
}
