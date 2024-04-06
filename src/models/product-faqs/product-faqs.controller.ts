import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ProductFaqsService } from './product-faqs.service';
import { Public, Roles, User } from '@/common/decorators';
import { RequestUser } from '@/interfaces';
import mongoose from 'mongoose';
import {
  CreateProductFaqDto,
  UpdateProductFaqDto,
} from '@/models/product-faqs/dto';
import { UserRole } from '@/enums';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Controller('product-faqs')
export class ProductFaqsController {
  constructor(private readonly productFaqsService: ProductFaqsService) {}

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Post()
  async create(
    @Body() createProductFaqDto: CreateProductFaqDto,
    @User() user: RequestUser,
  ) {
    try {
      const newProductFaq = await this.productFaqsService.create(
        createProductFaqDto,
        user.fullName,
      );
      if (newProductFaq) {
        return {
          id: newProductFaq._id.toString(),
          message: 'Product FAQ created successfully',
        };
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Public()
  @Get()
  findAll(@Query() query: ExpressQuery) {
    try {
      return this.productFaqsService.findAll(query);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId)
      throw new HttpException('Product FAQ not found', HttpStatus.NOT_FOUND);
    try {
      return await this.productFaqsService.findOne(id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductFaqDto: UpdateProductFaqDto,
    @User() user: RequestUser,
  ) {
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId)
      throw new HttpException('Product FAQ not found', HttpStatus.NOT_FOUND);
    try {
      await this.productFaqsService.update(
        id,
        updateProductFaqDto,
        user.fullName,
      );
      return {
        id: id,
        message: 'Product FAQ updated successfully',
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId)
      throw new HttpException('Product FAQ not found', HttpStatus.NOT_FOUND);
    try {
      await this.productFaqsService.remove(id);
      return {
        message: 'Product Faq deleted successfully',
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
