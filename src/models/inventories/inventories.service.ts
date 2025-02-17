import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';
import { Inventory } from '@/models/inventories/schemas/inventory.schema';
import {
  AddProductInventoryDto,
  CreateInventoryDto,
  MoveInventoryDto,
  ResponseInventoryDto,
  UpdateInventoryDto,
} from '@/models/inventories/dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { ProductVariantsService } from '@/models/product-variants/product-variants.service';
import { Pageable } from '@/interfaces';
import { Branch } from '@/models/branches/schemas/branch.schema';
import { ResponseBranchDto } from '@/models/branches/dto';
import { ResponseProductVariantDto } from '@/models/product-variants/dto/response-product-variant.dto';
import { Product } from '@/models/products/schemas/product.schema';
import { ResponseProductDto } from '@/models/products/dto';

@Injectable()
export class InventoriesService {
  constructor(
    @InjectModel(Inventory.name)
    private inventoryModel: Model<Inventory>,
    @InjectModel(Branch.name)
    private branchModel: Model<Branch>,
    @InjectModel(Product.name)
    private productModel: Model<Product>,
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

  async findTotalQuantityForBranch() {
    const inventories = await this.inventoryModel
      .find()
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

    const list = inventories.map((inventory) => {
      return {
        ...inventory,
        branch: inventory.branch,
        quantity: inventory.quantity,
      };
    });

    return list.reduce((acc: typeof list, cur) => {
      const found = acc.find((item) => item.branch.name === cur.branch.name);
      if (found && found.branch.name === cur.branch.name) {
        found.quantity += cur.quantity;
      } else {
        acc.push(cur);
      }
      return acc;
    }, []);
    // .map((inventory) => new ResponseInventoryDto(inventory));
  }

  async findAll(query: ExpressQuery): Promise<ResponseInventoryDto[]> {
    const filter = {
      ...(query.branch && { branch: query.branch }),
      ...(query.product && { product: query.product }),
      ...(query.productVariant && { productVariant: query.productVariant }),
    };

    const sort = (query.sort as string) || 'createdAt';
    const order = (query.order as SortOrder) || 'asc';

    const list = await this.inventoryModel
      .find({ ...filter })
      .select('-product')
      .sort({ [sort]: order })
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

    if (!list) throw new Error('Inventories not found');

    return list.map((inventory) => {
      return new ResponseInventoryDto(inventory);
    });
  }

  async search(query: ExpressQuery): Promise<Pageable<ResponseInventoryDto>> {
    const filter = {
      ...(query.branch && { branch: query.branch }),
      ...(query.product && { product: query.product }),
      ...(query.productVariant && { productVariant: query.productVariant }),
    };

    const currentPage = parseInt(query.page as string) || 1;
    const currentSize = parseInt(query.size as string) || 10;

    const totalRecord = await this.inventoryModel
      .countDocuments({ ...filter })
      .exec();
    const totalPage = Math.ceil(totalRecord / currentSize);

    const sort = (query.sort as string) || 'createdAt';
    const order = (query.order as SortOrder) || 'asc';
    const skip = (currentPage - 1) * currentSize;

    const list = await this.inventoryModel
      .find({ ...filter })
      .select('-product')
      .limit(currentSize)
      .skip(skip)
      .sort({ [sort]: order })
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

    if (!list) throw new Error('Inventories not found');

    const dtoList = list.map((inventory) => {
      return new ResponseInventoryDto(inventory);
    });

    return {
      currentPage,
      currentSize,
      totalRecord,
      totalPage,
      dtoList,
    };
  }

  async findInventoryById(id: string): Promise<ResponseInventoryDto> {
    const inventory = await this.inventoryModel
      .findById(id)
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

    if (!inventory) throw new Error('Inventory not found!');

    return new ResponseInventoryDto(inventory);
  }

  async findInventoryByBranchAndVariant(
    branchId: string,
    variantId: string,
  ): Promise<ResponseInventoryDto> {
    const inventory = await this.inventoryModel
      .findOne({
        branch: branchId,
        productVariant: variantId,
      })
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

    if (!inventory) throw new Error('Inventory not found!');

    return new ResponseInventoryDto(inventory);
  }

  async updateInventory(
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

    if (!updatedInventory)
      throw new Error('Inventory not found to update quantity.');

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
      const updatedInventory = await this.updateInventory(
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

  async deleteInventory(id: string) {
    const deletedInventory = await this.inventoryModel
      .findByIdAndDelete(id)
      .lean()
      .exec();

    if (!deletedInventory) throw new Error('Inventory not found');

    return new ResponseInventoryDto(deletedInventory);
  }

  async moveInventory(
    moveInventoryDto: MoveInventoryDto,
    updatedBy: string,
  ): Promise<void> {
    const productVariant = await this.productVariantsService.findOne(
      moveInventoryDto.productVariant,
    );

    if (!productVariant) throw new Error('Product variant not found!');

    const fromBranchInventory = await this.findInventoryByBranchAndVariant(
      moveInventoryDto.fromBranch,
      moveInventoryDto.productVariant,
    );

    if (moveInventoryDto.quantity > fromBranchInventory.quantity) {
      throw new Error('Not enough items to move!');
    }

    const addProductPayloadForToBranch: AddProductInventoryDto = {
      branch: moveInventoryDto.toBranch,
      product: productVariant.product._id.toString(),
      processor: fromBranchInventory.productVariant.processor,
      ram: fromBranchInventory.productVariant.ram,
      storage: fromBranchInventory.productVariant.storage,
      price: fromBranchInventory.productVariant.price,
      color: fromBranchInventory.productVariant.color,
      quantity: moveInventoryDto.quantity,
    };

    const updatedOrNewInventoryId = await this.addProduct(
      addProductPayloadForToBranch,
      updatedBy,
    );

    if (!updatedOrNewInventoryId)
      throw new Error(`Cannot move item to target branch!`);

    if (moveInventoryDto.quantity === fromBranchInventory.quantity) {
      await this.deleteInventory(fromBranchInventory._id.toString());
    } else {
      await this.updateInventory(
        fromBranchInventory._id.toString(),
        {
          quantity: fromBranchInventory.quantity - moveInventoryDto.quantity,
        },
        updatedBy,
      );
    }
  }

  async getInventoriesGroupByBranch() {
    const branches = await this.branchModel
      .find()
      .select('id name')
      .lean()
      .exec();
    if (!branches) throw new Error('Branches not found');
    const list = [];
    for (const branch of branches) {
      const inventories = await this.findAll({ branch: branch._id.toString() });
      if (!inventories) throw new Error('Inventories not found');
      inventories.length > 0 &&
        list.push({
          ...branch,
          inventories: inventories.map((inventory) => {
            return new ResponseInventoryDto(inventory);
          }),
        });
    }
    return list.map((item) => new ResponseBranchDto(item));
  }

  async getInventoryGroupByProductVarinats() {
    const allProductVariants = await this.productVariantsService.findAll({});
    if (!allProductVariants) throw new Error('Product variants not found');
    const list = [];
    for (const productVariant of allProductVariants) {
      const inventories = await this.findAll({
        productVariant: productVariant._id.toString(),
      });
      if (!inventories) throw new Error('Inventories not found');

      if (inventories.length > 0)
        list.push({
          ...productVariant,
          name: productVariant.product.name,
          inventories: inventories.map((inventory) => {
            return new ResponseInventoryDto(inventory);
          }),
        });
    }
    return list.map(
      (productVariant) => new ResponseProductVariantDto(productVariant),
    );
  }

  async getInventoriesGroupByProduct() {
    const products = await this.productModel
      .find()
      .select('id name')
      .lean()
      .exec();
    if (!products) throw new Error('Branches not found');
    const list = [];
    for (const product of products) {
      const inventories = await this.findAll({
        product: product._id.toString(),
      });
      if (!inventories) throw new Error('Inventories not found');
      inventories.length > 0 &&
        list.push({
          id: product._id.toString(),
          name: product.name,
          inventories: inventories.map((inventory) => {
            return new ResponseInventoryDto(inventory);
          }),
        });
    }
    return list;
  }
}
