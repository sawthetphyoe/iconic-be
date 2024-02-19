import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Query,
  Param,
  Patch,
} from '@nestjs/common';
import { InventoriesService } from './inventories.service';
import { User } from '@/common/decorators';
import { MutationSuccessResponse, Pageable, RequestUser } from '@/interfaces';
import {
  AddProductInventoryDto,
  ResponseInventoryDto,
  UpdateInventoryDto,
} from '@/models/inventories/dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import mongoose from 'mongoose';

@Controller('inventories')
export class InventoriesController {
  constructor(private readonly inventoryService: InventoriesService) {}

  // Add product (new or existing product-variant ) to inventory
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
  async findAll(
    @Query() query: ExpressQuery,
  ): Promise<Pageable<ResponseInventoryDto>> {
    try {
      return this.inventoryService.findAll(query);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Update quantity of product-variant in inventory
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body()
    updateInventoryDto: UpdateInventoryDto,
    @User() user: RequestUser,
  ): Promise<MutationSuccessResponse> {
    const isIdValid = mongoose.Types.ObjectId.isValid(id);
    if (!isIdValid)
      throw new HttpException(
        'Product mapping not found',
        HttpStatus.BAD_REQUEST,
      );

    try {
      const updatedInventory = await this.inventoryService.updateQuantity(
        id,
        {
          quantity: updateInventoryDto.quantity,
        },
        user.fullName,
      );
      return {
        id: updatedInventory._id.toString(),
        message: 'Item count updated successfully',
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
