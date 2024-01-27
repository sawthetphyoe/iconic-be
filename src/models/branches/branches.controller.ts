import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { BranchesService } from './branches.service';
import { CreateBranchDto, UpdateBranchDto } from '@/models/branches/dto';
import { MutationSuccessResponse, RequestUser } from '@/interfaces';
import { Roles, User } from '@/common/decorators';
import { UserRole } from '@/enums';
import mongoose from 'mongoose';
import { ResponseBranchDto } from '@/models/branches/dto/response-branch.dto';

@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN)
  async create(
    @Body() createBranchDto: CreateBranchDto,
    @User() user: RequestUser,
  ): Promise<MutationSuccessResponse> {
    try {
      const branch = await this.branchesService.create(
        createBranchDto,
        user.fullName,
      );
      return {
        id: branch._id.toString(),
        message: 'Branch created successfully',
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  findAll(): Promise<ResponseBranchDto[]> {
    try {
      return this.branchesService.findAll();
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ResponseBranchDto> {
    const isIdValid = mongoose.Types.ObjectId.isValid(id);
    if (!isIdValid)
      throw new HttpException('Branch not found', HttpStatus.NOT_FOUND);

    try {
      return await this.branchesService.findOne(id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateBranchDto: UpdateBranchDto,
    @User() user: RequestUser,
  ): Promise<MutationSuccessResponse> {
    const isIdValid = mongoose.Types.ObjectId.isValid(id);
    if (!isIdValid)
      throw new HttpException('Branch not found', HttpStatus.NOT_FOUND);

    try {
      await this.branchesService.update(id, updateBranchDto, user.fullName);

      return {
        id,
        message: 'Branch updated successfully',
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
      throw new HttpException('Branch not found', HttpStatus.NOT_FOUND);

    try {
      await this.branchesService.remove(id);
      return {
        message: 'Branch deleted successfully',
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
