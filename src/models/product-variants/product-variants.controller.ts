import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ProductVariantsService } from './product-variants.service';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { RequestUser } from '@/interfaces';
import { User } from '@/common/decorators';
import { Query as ExpressQuery } from 'express-serve-static-core';
import mongoose from 'mongoose';

@Controller('product-variants')
export class ProductVariantsController {
  constructor(
    private readonly productVariantsService: ProductVariantsService,
  ) {}

  @Post()
  create(
    @Body() createProductVariantDto: CreateProductVariantDto,
    @User() user: RequestUser,
  ) {
    return this.productVariantsService.create(
      createProductVariantDto,
      user.fullName,
    );
  }

  @Get()
  async findAll(@Query() query: ExpressQuery) {
    try {
      return await this.productVariantsService.findAll(query);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const isIdValid = mongoose.Types.ObjectId.isValid(id);
    if (!isIdValid)
      throw new HttpException(
        'Product variant not found',
        HttpStatus.NOT_FOUND,
      );
    try {
      return this.productVariantsService.findOne(id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }
}
