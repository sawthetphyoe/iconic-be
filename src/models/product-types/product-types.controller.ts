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
} from '@nestjs/common';
import {
  CreateProductTypeDto,
  UpdateProductTypeDto,
} from '@/models/product-types/dto';
import { User } from '@/common/decorators';
import { ProductTypesService } from './product-types.service';
import { MutationSuccessResponse, RequestUser } from '@/interfaces';
import mongoose from 'mongoose';
import { ResponseProductTypeDto } from '@/models/product-types/dto/response-product-type.dto';

@Controller('product-types')
export class ProductTypesController {
  constructor(private readonly productTypesService: ProductTypesService) {}

  @Post()
  async create(
    @Body() createProductTypeDto: CreateProductTypeDto,
    @User() user: RequestUser,
  ): Promise<MutationSuccessResponse> {
    try {
      const newProductType = await this.productTypesService.create(
        createProductTypeDto,
        user.fullName,
      );
      return {
        id: newProductType._id.toString(),
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
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const isIdValid = mongoose.Types.ObjectId.isValid(id);
    if (!isIdValid)
      throw new HttpException('Product Type not found', HttpStatus.BAD_REQUEST);

    try {
      return await this.productTypesService.findOne(id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductTypeDto: UpdateProductTypeDto,
    @User() user: RequestUser,
  ) {
    const isIdValid = mongoose.Types.ObjectId.isValid(id);
    if (!isIdValid)
      throw new HttpException('Product Type not found', HttpStatus.BAD_REQUEST);

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
    const isIdValid = mongoose.Types.ObjectId.isValid(id);
    if (!isIdValid)
      throw new HttpException('Product Type not found', HttpStatus.BAD_REQUEST);

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
