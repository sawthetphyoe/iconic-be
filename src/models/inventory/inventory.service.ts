import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inventory } from '@/models/inventory/schemas/inventory.schemas';
import { CreateProductVariantDto } from '@/models/product-variants/dto/create-product-variant.dto';
import { ProductVariantsService } from '@/models/product-variants/product-variants.service';
import { CreateInventoryDto, ResponseInventoryDto, UpdateInventoryDto } from '@/models/inventory/dto';

@Injectable()
export class InventoryService {
  constructor(private productVariantsService: ProductVariantsService,
              @InjectModel(Inventory.name)
              private inventoryModel: Model<Inventory>) {
  }

  async create(createInventoryDto: CreateInventoryDto, userName: string) {

    // filter data to search product variant is present or not
    const filterData = {
      product: createInventoryDto.product,
      color: createInventoryDto.color,
      processor: createInventoryDto.processor,
      ram: createInventoryDto.ram,
      storage: createInventoryDto.storage,
    };

    // find product variant by filter data
    let productVariant = await this.productVariantsService.findBy(filterData);

    console.log('Product Variant - ', productVariant);
    if (productVariant.length <= 0) {
      console.log('No product variant found and creating new product variant');
      let newProductVariantBody: CreateProductVariantDto = {
        product: createInventoryDto.product,
        color: createInventoryDto.color,
        processor: createInventoryDto.processor,
        ram: createInventoryDto.ram,
        storage: createInventoryDto.storage,
        price: createInventoryDto.price,
        createdBy: userName,
      };
      // create new product variant
      let productVariant = await this.productVariantsService.create(newProductVariantBody, userName);

      // create new inventory
      let newInventoryBody = {
        branch: createInventoryDto.branch,
        productVariant: productVariant._id.toString(),
        inStock: createInventoryDto.inStock,
        createdBy: userName,
      };

      let newInventory = new this.inventoryModel(newInventoryBody);
      if (!newInventory) throw new Error('Inventory create failed');
      return newInventory.save();
    }

    // create new inventory
    let newInventoryBody = {
      branch: createInventoryDto.branch,
      productVariant: productVariant[0]._id.toString(),
      inStock: createInventoryDto.inStock,
      createdBy: userName,
    };
    let newInventory = new this.inventoryModel(newInventoryBody);
    if (!newInventory) throw new Error('Inventory create failed');
    await newInventory.save();
    return newInventory;
  }

  async findAll() {
    let inventories = await this.inventoryModel.find().populate({
      path: 'branch',
      select: '_id name',
    }).populate({
      path: 'productVariant',
      select: '_id product color processor ram storage price',
      populate: {
        path: 'product',
        select: '_id name',
      },
    }).lean().exec();
    if (!inventories) throw new Error('Inventories not found');

    console.log("Inventories - ", inventories);
    return inventories.map((inventory) => {
      return new ResponseInventoryDto(inventory);
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} inventory`;
  }

  update(id: number, updateInventoryDto: UpdateInventoryDto) {
    return `This action updates a #${id} inventory`;
  }

  remove(id: number) {
    return `This action removes a #${id} inventory`;
  }
}
