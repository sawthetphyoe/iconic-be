import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inventory } from '@/models/inventory/schemas/inventory.schema';
import {
  AddProductInventoryDto,
  CreateInventoryDto,
  ResponseInventoryDto,
  UpdateInventoryDto,
} from '@/models/inventory/dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { ProductVariantsService } from '@/models/product-variants/product-variants.service';
@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Inventory.name)
    private inventoryModel: Model<Inventory>,
    private productVariantsService: ProductVariantsService,
  ) {}

  async create(createInventoryDto: CreateInventoryDto, userName: string) {
    const newInventory = new this.inventoryModel({
      ...createInventoryDto,
      createdBy: userName,
    });

    if (!newInventory) throw new Error('Inventory create failed');

    return newInventory.save();
  }

  async findAll(query: ExpressQuery) {
    const filter = {
      ...(query.branch && { branch: query.branch }),
      ...(query.product && { product: query.product }),
      ...(query.productVariant && { productVariant: query.productVariant }),
    };

    const inventories = await this.inventoryModel
      .find({ ...filter })
      .select('-product')
      .populate({
        path: 'productVariant',
        select: '_id product color processor ram storage price',
        populate: {
          path: 'product',
          select: '_id name',
        },
      })
      .populate({ path: 'branch', select: '_id name' })
      .lean()
      .exec();

    if (!inventories) throw new Error('Inventories not found');

    return inventories.map((inventory) => {
      return new ResponseInventoryDto(inventory);
    });
  }

  async update(
    id: string,
    updateInventoryDto: UpdateInventoryDto,
    updatedBy: string,
  ) {
    const updatedInventory = await this.inventoryModel
      .findByIdAndUpdate(
        id,
        { ...updateInventoryDto, updatedBy, updatedAt: new Date() },
        { new: true },
      )
      .select('-product')
      .populate({ path: 'branch', select: '_id name' })
      .populate({
        path: 'productVariant',
        select: '_id product color processor ram storage price',
        populate: {
          path: 'product',
          select: '_id name',
        },
      })
      .lean()
      .exec();

    if (!updatedInventory) throw new Error('Inventory not found');

    return new ResponseInventoryDto(updatedInventory);
  }

  async addProduct(
    addProductInventoryDto: AddProductInventoryDto,
    updatedBy: string,
  ): Promise<string> {
    const productVariant =
      await this.productVariantsService.getProductVariantForInventory(
        addProductInventoryDto,
        updatedBy,
      );

    const createInventoryDto: CreateInventoryDto = {
      productVariant: productVariant._id.toString(),
      product: addProductInventoryDto.product,
      quantity: addProductInventoryDto.quantity,
      branch: addProductInventoryDto.branch,
    };

    const filterData: Omit<CreateInventoryDto, 'product' | 'quantity'> = {
      branch: createInventoryDto.branch,
      productVariant: productVariant._id.toString(),
    };

    const existingInventory = await this.inventoryModel
      .findOne(filterData)
      .select('-product')
      .populate({
        path: 'productVariant',
        select: '_id product color processor ram storage price',
        populate: {
          path: 'product',
          select: '_id name',
        },
      })
      .populate({ path: 'branch', select: '_id name' })
      .lean()
      .exec();

    if (existingInventory) {
      const updatedInventory = await this.update(
        existingInventory._id.toString(),
        {
          quantity: existingInventory.quantity + createInventoryDto.quantity,
        },
        updatedBy,
      );

      if (!updatedInventory) throw new Error('Inventory update failed');

      return updatedInventory._id.toString();
    }

    const newInventory = await this.create(createInventoryDto, updatedBy);

    if (!newInventory) throw new Error('Inventory create failed');

    return newInventory._id.toString();
  }
}
