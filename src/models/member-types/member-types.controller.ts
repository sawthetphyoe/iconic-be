import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { MemberTypesService } from './member-types.service';
import { CreateMemberTypeDto } from './dto/create-member-type.dto';
import { UpdateMemberTypeDto } from './dto/update-member-type.dto';
import { Roles, User } from '@/common/decorators';
import { RequestUser } from '@/interfaces';
import mongoose from 'mongoose';
import { UserRole } from '@/enums';

@Controller('member-types')
export class MemberTypesController {
  constructor(private readonly memberTypesService: MemberTypesService) {}

  @Roles(UserRole.SUPER_ADMIN)
  @Post()
  async create(
    @Body() createMemberTypeDto: CreateMemberTypeDto,
    @User() user: RequestUser,
  ) {
    try {
      const memberType = await this.memberTypesService.create(
        createMemberTypeDto,
        user.fullName,
      );

      return {
        id: memberType._id.toString(),
        message: 'Member type created successfully',
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  findAll() {
    try {
      return this.memberTypesService.findAll();
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Roles(UserRole.SUPER_ADMIN)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMemberTypeDto: UpdateMemberTypeDto,
    @User() user: RequestUser,
  ) {
    const isIdValid = mongoose.Types.ObjectId.isValid(id);
    if (!isIdValid)
      throw new HttpException('Member type not found', HttpStatus.NOT_FOUND);
    try {
      await this.memberTypesService.update(
        id,
        updateMemberTypeDto,
        user.fullName,
      );

      return {
        id,
        message: 'Member type updated successfully',
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
