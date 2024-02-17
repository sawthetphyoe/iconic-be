import { Injectable } from '@nestjs/common';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ProductVariant } from '@/models/product-variants/schemas/product-variant.schema';
import { Model } from 'mongoose';
import { ResponseProductVariantDto } from '@/models/product-variants/dto/response-product-variant.dto';
import { AddProductInventoryDto } from '@/models/inventory/dto';

export type ExistingMappingFilterData = {
  product: string;
  color: string;
  processor: string;
  ram: string;
  storage: string;
};

@Injectable()
export class ProductVariantsService {
  constructor(
    @InjectModel(ProductVariant.name)
    private productVariantModel: Model<ProductVariant>,
  ) {}

  async create(
    createProductVariantDto: CreateProductVariantDto,
    userName: string,
  ) {
    const newProductVariant = new this.productVariantModel({
      ...createProductVariantDto,
      createdBy: userName,
    });
    if (!newProductVariant) throw new Error('Product Variant create failed');
    return newProductVariant.save();
  }

  async findAll() {
    const allProductVariants = await this.productVariantModel
      .find()
      .populate({
        path: 'product',
        select: 'name productType',
        populate: {
          path: 'productType',
          select: 'name',
        },
      })
      .lean()
      .exec();
    if (!allProductVariants) throw new Error('Products Variants not found');
    return allProductVariants.map(
      (productVariant) => new ResponseProductVariantDto(productVariant),
    );
  }

  async findOne(id: string) {
    const productVariant = await this.productVariantModel
      .findById(id)
      .populate({
        path: 'product',
        select: 'name productType',
        populate: {
          path: 'productType',
          select: 'name',
        },
      })
      .lean()
      .exec();
    if (!productVariant) throw new Error('Product Variant not found');

    return new ResponseProductVariantDto(productVariant);
  }

  async getProductVariantForInventory(
    addProductInventoryDto: AddProductInventoryDto,
    userName: string,
  ): Promise<ResponseProductVariantDto> {
    const filterData: ExistingMappingFilterData = {
      product: addProductInventoryDto.product,
      color: addProductInventoryDto.color,
      processor: addProductInventoryDto.processor,
      ram: addProductInventoryDto.ram,
      storage: addProductInventoryDto.storage,
    };

    const existingVariant = await this.productVariantModel
      .findOne(filterData)
      .populate({
        path: 'product',
        select: 'name productType',
        populate: {
          path: 'productType',
          select: 'name',
        },
      })
      .lean()
      .exec();

    if (existingVariant) return new ResponseProductVariantDto(existingVariant);

    const createProductVariantDto: CreateProductVariantDto = {
      product: addProductInventoryDto.product,
      color: addProductInventoryDto.color,
      processor: addProductInventoryDto.processor,
      ram: addProductInventoryDto.ram,
      storage: addProductInventoryDto.storage,
      price: addProductInventoryDto.price,
    };

    const newProductVariant = await this.create(
      createProductVariantDto,
      userName,
    );

    if (!newProductVariant) throw new Error('Product Variant create failed');

    return this.findOne(newProductVariant._id.toString());
  }
}
