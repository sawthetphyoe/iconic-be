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
  MoveInventoryDto,
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

  // Move product-variant to other branch
  @Patch('move')
  async moveProduct(
    @Body()
    moveInventoryDto: MoveInventoryDto,
    @User() user: RequestUser,
  ) {
    const isFromBranchValid = mongoose.Types.ObjectId.isValid(
      moveInventoryDto.fromBranch,
    );
    if (!isFromBranchValid)
      throw new HttpException('Invalid source branch!', HttpStatus.BAD_REQUEST);

    const isToBranchValid = mongoose.Types.ObjectId.isValid(
      moveInventoryDto.fromBranch,
    );
    if (!isToBranchValid)
      throw new HttpException('Invalid target branch!', HttpStatus.BAD_REQUEST);

    const isProductVariantValid = mongoose.Types.ObjectId.isValid(
      moveInventoryDto.productVariant,
    );
    if (!isProductVariantValid)
      throw new HttpException(
        'Product variant not found!',
        HttpStatus.BAD_REQUEST,
      );

    try {
      await this.inventoryService.moveInventory(
        moveInventoryDto,
        user.fullName,
      );
      return {
        message: `${moveInventoryDto.quantity} item${moveInventoryDto.quantity > 1 ? 's have' : ' has'} moved successfully.`,
      };
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
      if (updateInventoryDto.quantity > 0) {
        const updatedInventory = await this.inventoryService.updateInventory(
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
      } else {
        const deletedInventory =
          await this.inventoryService.deleteInventory(id);

        return {
          id: deletedInventory._id.toString(),
          message: 'Inventory deleted successfully',
        };
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
