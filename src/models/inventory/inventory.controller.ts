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
  CreateInventoryDto,
  ResponseInventoryDto,
} from '@/models/inventory/dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { ProductVariantsService } from '@/models/product-variants/product-variants.service';

@Controller('inventory')
export class InventoryController {
  constructor(
    private productVariantsService: ProductVariantsService,
    private readonly inventoryService: InventoryService,
  ) {}

  @Post()
  async addProduct(
    @Body() addProductInventoryDto: AddProductInventoryDto,
    @User() user: RequestUser,
  ) {
    try {
      const productVariantId =
        await this.productVariantsService.getProductVariantId(
          addProductInventoryDto,
          user.fullName,
        );

      const createInventoryDto: CreateInventoryDto = {
        productVariant: productVariantId,
        product: addProductInventoryDto.product,
        quantity: addProductInventoryDto.quantity,
        branch: addProductInventoryDto.branch,
      };

      const addedInventoryId = await this.inventoryService.addProduct(
        createInventoryDto,
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
