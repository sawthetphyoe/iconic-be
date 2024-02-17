import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { User } from '@/common/decorators';
import { RequestUser } from '@/interfaces';
import {
  AddProductInventoryDto,
  ResponseInventoryDto,
} from '@/models/inventory/dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import mongoose from 'mongoose';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  async addProduct(
    @Body() addProductInventoryDto: AddProductInventoryDto,
    @User() user: RequestUser,
  ) {
    const isIdValidProduct = mongoose.Types.ObjectId.isValid(
      addProductInventoryDto.product,
    );
    if (!isIdValidProduct)
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);

    const isIdValidBranch = mongoose.Types.ObjectId.isValid(
      addProductInventoryDto.branch,
    );
    if (!isIdValidBranch)
      throw new HttpException('Branch not found', HttpStatus.NOT_FOUND);

    try {
      const addedInventoryId = await this.inventoryService.addProduct(
        addProductInventoryDto,
        user.fullName,
      );

      if (addedInventoryId) {
        return {
          id: addedInventoryId,
          message: 'Product added to inventory successfully',
        };
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll(@Query() query: ExpressQuery): Promise<ResponseInventoryDto[]> {
    try {
      return await this.inventoryService.findAll(query);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
