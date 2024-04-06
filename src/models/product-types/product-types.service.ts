import { Injectable } from '@nestjs/common';
import {
  CreateProductTypeDto,
  UpdateProductTypeDto,
} from '@/models/product-types/dto';
import { InjectModel } from '@nestjs/mongoose';
import { ProductType } from '@/models/product-types/schemas/product-type.schema';
import { Model } from 'mongoose';
import { ResponseProductTypeDto } from '@/models/product-types/dto/response-product-type.dto';
import { ProductsService } from '@/models/products/products.service';
import { ProductVariantsService } from '@/models/product-variants/product-variants.service';

@Injectable()
export class ProductTypesService {
  constructor(
    @InjectModel(ProductType.name)
    private productTypeModel: Model<ProductType>,
    private productService: ProductsService,
    private productVariantService: ProductVariantsService,
  ) {}
  async create(createProductTypeDto: CreateProductTypeDto, createdBy: string) {
    const newProductType = new this.productTypeModel({
      ...createProductTypeDto,
      createdBy,
    });

    if (!newProductType) throw new Error('Product Type create failed');

    return newProductType.save();
  }

  async findByName(name: string) {
    const productType = await this.productTypeModel
      .findOne({ name })
      .lean()
      .exec();

    if (!productType) throw new Error('Product Type not found');

    return new ResponseProductTypeDto(productType);
  }

  async findAll() {
    const productTypes = await this.productTypeModel.find().lean().exec();

    if (!productTypes) throw new Error('Product Types not found');

    const list = await Promise.all(
      productTypes.map(async (item) => {
        const productCount = await this.productService.getProductCountByType(
          item._id.toString(),
        );
        return {
          ...item,
          productCount,
        };
      }),
    );

    return list.map((productType) => new ResponseProductTypeDto(productType));
  }

  async findAllDetails() {
    const productTypes = await this.productTypeModel
      .find()
      .select('-createdAt -createdBy -updatedAt -updatedBy')
      .lean()
      .exec();

    if (!productTypes) throw new Error('Product Types not found');

    const response = [];

    for (const productType of productTypes) {
      const products = await this.productService.findAll({
        productType: productType._id.toString(),
      });
      response.push({
        ...productType,
        products: products.map((item) => ({
          id: item._id.toString(),
          name: item.name,
        })),
      });
    }

    return response.map(
      (productType) => new ResponseProductTypeDto(productType),
    );
  }

  async findOne(id: string) {
    const productType = await this.productTypeModel.findById(id).lean().exec();
    if (!productType) throw new Error('Product Type not found');
    return new ResponseProductTypeDto(productType);
  }

  async update(
    id: string,
    updateProductTypeDto: UpdateProductTypeDto,
    updatedBy: string,
  ) {
    const updatedProductType = await this.productTypeModel
      .findByIdAndUpdate(
        id,
        { ...updateProductTypeDto, updatedBy, updatedAt: new Date() },
        { new: true },
      )
      .lean()
      .exec();

    if (!updatedProductType) throw new Error('Product Type not found');

    return new ResponseProductTypeDto(updatedProductType);
  }

  async remove(id: string) {
    const productCount = await this.productService.getProductCountByType(id);

    if (productCount > 0)
      throw new Error(
        `Cannot delete product type. ${productCount} product${productCount > 1 ? 's' : ''} assigned to it.`,
      );

    const deletedProductType = await this.productTypeModel
      .findByIdAndDelete(id)
      .lean()
      .exec();

    if (!deletedProductType) throw new Error('Product Type not found');

    return new ResponseProductTypeDto(deletedProductType);
  }
}
