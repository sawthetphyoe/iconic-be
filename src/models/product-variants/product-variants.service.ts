import { Injectable } from '@nestjs/common';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ProductVariant } from '@/models/product-variants/schemas/product-variant.schema';
import mongoose, { FlattenMaps, Model } from 'mongoose';
import { ResponseProductVariantDto } from '@/models/product-variants/dto/response-product-variant.dto';
import { AddProductInventoryDto } from '@/models/inventories/dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { Inventory } from '@/models/inventories/schemas/inventory.schema';

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
    @InjectModel(Inventory.name)
    private inventoryModel: Model<Inventory>,
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

  async findAll(query: ExpressQuery) {
    const filter = {
      ...(query.product && { product: query.product }),
    };
    const allProductVariants = await this.productVariantModel
      .find({ ...filter })
      .populate({
        path: 'product',
        select: 'name productType images',
        populate: {
          path: 'productType',
          select: 'name',
        },
      })
      .lean()
      .exec();
    if (!allProductVariants) throw new Error('Products Variants not found');

    return allProductVariants.map(
      (productVariant) =>
        new ResponseProductVariantDto({
          ...productVariant,
          product: { ...productVariant.product, images: undefined },
          image: productVariant.product.images.find(
            (item) => item.color === productVariant.color,
          ),
        }),
    );
  }

  async findNewArrivals() {
    const allProductVariants = await this.productVariantModel
      .find()
      .select('-createdAt -createdBy -updatedAt -updatedBy')
      .populate({
        path: 'product',
        select: 'name productType images',
        populate: {
          path: 'productType',
          select: 'name',
        },
      })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()
      .exec();
    if (!allProductVariants) throw new Error('Products Variants not found');

    const list: (FlattenMaps<ProductVariant> & {
      _id: mongoose.Types.ObjectId;
    })[] = [];

    for (const productVariant of allProductVariants) {
      const inventoryCount = await this.inventoryModel
        .find({ productVariant: productVariant._id.toString() })
        .countDocuments();
      if (inventoryCount > 0) list.push(productVariant);
    }

    return list.map(
      (productVariant) =>
        new ResponseProductVariantDto({
          ...productVariant,
          product: { ...productVariant.product, images: undefined },
          image: productVariant.product.images.find(
            (item) => item.color === productVariant.color,
          ),
        }),
    );
  }

  async findOne(id: string) {
    const productVariant = await this.productVariantModel
      .findById(id)
      .populate({
        path: 'product',
        select: 'name productType images',
        populate: {
          path: 'productType',
          select: 'name',
        },
      })
      .lean()
      .exec();
    if (!productVariant) throw new Error('Product Variant not found');

    return new ResponseProductVariantDto({
      ...productVariant,
      product: { ...productVariant.product, images: undefined },
      image: productVariant.product.images.find(
        (item) => item.color === productVariant.color,
      ),
    });
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

  async delete(id: string) {
    const deletedProductVariant = await this.productVariantModel
      .findByIdAndDelete(id)
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

    if (!deletedProductVariant) throw new Error('Product Variant not found');

    return new ResponseProductVariantDto(deletedProductVariant);
  }
}
