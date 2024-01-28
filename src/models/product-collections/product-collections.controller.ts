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
  CreateProductCollectionDto,
  UpdateProductCollectionDto,
} from '@/models/product-collections/dto';
import { User } from '@/common/decorators';
import { MutationSuccessResponse, RequestUser } from '@/interfaces';
import { ProductCollectionsService } from './product-collections.service';
import { ResponseProductCollectionDto } from '@/models/product-collections/dto/response-product-collection.dto';
import mongoose from 'mongoose';

@Controller('collections')
export class ProductCollectionsController {
  constructor(
    private readonly productCollectionsService: ProductCollectionsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createProductCollectionDto: CreateProductCollectionDto,
    @User() user: RequestUser,
  ): Promise<MutationSuccessResponse> {
    try {
      const newCollection = await this.productCollectionsService.create(
        createProductCollectionDto,
        user.fullName,
      );
      return {
        id: newCollection._id.toString(),
        message: 'Product Collection created successfully',
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll(): Promise<ResponseProductCollectionDto[]> {
    try {
      return await this.productCollectionsService.findAll();
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<ResponseProductCollectionDto> {
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId)
      throw new HttpException(
        'Product Collection not found',
        HttpStatus.NOT_FOUND,
      );

    try {
      return await this.productCollectionsService.findOne(id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductCollectionDto: UpdateProductCollectionDto,
    @User() user: RequestUser,
  ): Promise<MutationSuccessResponse> {
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId)
      throw new HttpException(
        'Product Collection not found',
        HttpStatus.NOT_FOUND,
      );

    try {
      await this.productCollectionsService.update(
        id,
        updateProductCollectionDto,
        user.fullName,
      );
      return {
        id,
        message: 'Product Collection updated successfully',
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<MutationSuccessResponse> {
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId)
      throw new HttpException(
        'Product Collection not found',
        HttpStatus.NOT_FOUND,
      );

    try {
      await this.productCollectionsService.remove(id);
      return {
        message: 'Product Collection deleted successfully',
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
