import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  ValidationPipe,
  UsePipes,
  HttpCode,
  Query,
} from '@nestjs/common';
import { StaffService } from './staff.service';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { CreateStaffDto, UpdateStaffDto } from './dto';
import mongoose from 'mongoose';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get('roles')
  getRoles() {
    return this.staffService.getRoles();
  }

  @Post()
  @HttpCode(201)
  @UsePipes(new ValidationPipe())
  async create(@Body() createStaffDto: CreateStaffDto) {
    await this.staffService.create(createStaffDto);

    return {
      message: 'Staff created successfully',
    };
  }

  @Get()
  findAll(@Query() query: ExpressQuery) {
    return this.staffService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const isIdValid = mongoose.Types.ObjectId.isValid(id);
    if (!isIdValid) throw new HttpException('Staff not found', 404);

    const staff = this.staffService.findOne(id);
    if (!staff) throw new HttpException('Staff not found', 404);

    return this.staffService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id') id: string,
    @Body() updateStaffDto: UpdateStaffDto,
  ) {
    const isIdValid = mongoose.Types.ObjectId.isValid(id);
    if (!isIdValid) throw new HttpException('Invalid Staff ID', 404);

    const updatedStaff = await this.staffService.update(id, updateStaffDto);
    if (!updatedStaff) throw new HttpException('Staff not found', 404);

    return {
      id,
      message: 'Staff updated successfully',
    };
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    const isIdValid = mongoose.Types.ObjectId.isValid(id);
    if (!isIdValid) throw new HttpException('Invalid Staff ID', 400);

    const deletedStaff = await this.staffService.remove(id);
    if (!deletedStaff) throw new HttpException('Staff not found', 404);

    this.staffService.remove(id);

    return {
      id,
      message: 'Staff deleted successfully',
    };
  }
}
