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
} from '@nestjs/common';
import {
  CreateProductTypeDto,
  UpdateProductTypeDto,
} from '@/models/product-types/dto';
import { User } from '@/common/decorators';
import { MutationSuccessResponse, RequestUser } from '@/interfaces';
import { ProductTypesService } from './product-types.service';
import { ResponseProductTypeDto } from '@/models/product-types/dto/response-product-type.dto';
import mongoose from 'mongoose';

@Controller('product-types')
export class ProductTypesController {
  constructor(private readonly productTypesService: ProductTypesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createProductTypeDto: CreateProductTypeDto,
    @User() user: RequestUser,
  ): Promise<MutationSuccessResponse> {
    try {
      const newType = await this.productTypesService.create(
        createProductTypeDto,
        user.fullName,
      );
      return {
        id: newType._id.toString(),
        message: 'Product Type created successfully',
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll(): Promise<ResponseProductTypeDto[]> {
    try {
      return await this.productTypesService.findAll();
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ResponseProductTypeDto> {
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId)
      throw new HttpException('Product Type not found', HttpStatus.NOT_FOUND);
    try {
      return await this.productTypesService.findOne(id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductTypeDto: UpdateProductTypeDto,
    @User() user: RequestUser,
  ): Promise<MutationSuccessResponse> {
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId)
      throw new HttpException('Product Type not found', HttpStatus.NOT_FOUND);

    try {
      await this.productTypesService.update(
        id,
        updateProductTypeDto,
        user.fullName,
      );
      return {
        id,
        message: 'Product Type updated successfully',
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<MutationSuccessResponse> {
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId)
      throw new HttpException('Product Type not found', HttpStatus.NOT_FOUND);

    try {
      await this.productTypesService.remove(id);
      return {
        message: 'Product Type deleted successfully',
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
