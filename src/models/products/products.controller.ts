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
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from '@/models/products/dto';
import { User } from '@/common/decorators';
import { ProductsService } from './products.service';
import { MutationSuccessResponse, RequestUser } from '@/interfaces';
import mongoose from 'mongoose';
import { ResponseProductDto } from '@/models/products/dto/response-product.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { DoSpacesService } from '@/doSpaces/doSpace.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productTypesService: ProductsService,
    private readonly doSpacesService: DoSpacesService,
  ) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() createProductTypeDto: CreateProductDto,
    @User() user: RequestUser,
  ) {
    try {
      const availableColors = await Promise.all(
        files.map((file) =>
          this.doSpacesService.uploadFile(
            file,
            `${createProductTypeDto.name.toLowerCase().split(' ').join('_')}_${
              file.fieldname
            }`,
          ),
        ),
      );

      const newProductType = await this.productTypesService.create(
        createProductTypeDto,
        availableColors,
        user.fullName,
      );
      return {
        id: newProductType._id.toString(),
        message: 'Product created successfully',
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll(): Promise<ResponseProductDto[]> {
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
      throw new HttpException('Product not found', HttpStatus.BAD_REQUEST);

    try {
      return await this.productTypesService.findOne(id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductTypeDto: UpdateProductDto,
    @User() user: RequestUser,
  ) {
    const isIdValid = mongoose.Types.ObjectId.isValid(id);
    if (!isIdValid)
      throw new HttpException('Product not found', HttpStatus.BAD_REQUEST);

    try {
      await this.productTypesService.update(
        id,
        updateProductTypeDto,
        user.fullName,
      );

      return {
        id,
        message: 'Product updated successfully',
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<MutationSuccessResponse> {
    const isIdValid = mongoose.Types.ObjectId.isValid(id);
    if (!isIdValid)
      throw new HttpException('Product not found', HttpStatus.BAD_REQUEST);

    try {
      await this.productTypesService.remove(id);
      return {
        message: 'Product deleted successfully',
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
