import { Injectable } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from '@/models/products/dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from '@/models/products/schemas/product.schema';
import mongoose, { Model } from 'mongoose';
import { ResponseProductDto } from '@/models/products/dto/response-product.dto';
import { ProductType } from '@/models/product-types/schemas/product-type.schema';
import { SYSTEM } from '@/common/constants';
import { ProductColorImage } from '@/interfaces';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(ProductType.name)
    private productTypeModel: Model<ProductType>,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    availableColors: ProductColorImage[],
    createdBy: string,
  ) {
    const isValidId = mongoose.Types.ObjectId.isValid(
      createProductDto.productType,
    );
    if (!isValidId) throw new Error('Invalid Product Type ID');

    const productType = await this.productTypeModel.findById(
      createProductDto.productType,
    );

    if (!productType) throw new Error('Invalid Product Type ID');

    const newProduct = new this.productModel({
      ...createProductDto,
      availableColors,
      createdBy,
    });

    if (!newProduct) throw new Error('Product create failed');

    return newProduct.save();
  }

  async findAll() {
    const products = await this.productModel
      .find()
      .populate('productType')
      .lean()
      .exec();

    if (!products) throw new Error('Products not found');

    return products.map((productType) => new ResponseProductDto(productType));
  }

  async findOne(id: string) {
    const product = await this.productModel
      .findById(id)
      .populate('productType')
      .lean()
      .exec();

    if (!product) throw new Error('Product not found');

    return new ResponseProductDto(product);
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    updatedBy: string,
  ) {
    if (updateProductDto.productType) {
      const isValidId = mongoose.Types.ObjectId.isValid(
        updateProductDto?.productType,
      );
      if (!isValidId) throw new Error('Invalid Product Type ID');
    }

    const updatedProduct = await this.productModel
      .findByIdAndUpdate(
        id,
        {
          ...updateProductDto,
          updatedBy,
          updatedAt: new Date(),
        },
        { new: true },
      )
      .populate('productType')
      .lean()
      .exec();

    if (!updatedProduct) throw new Error('Product not found');

    return new ResponseProductDto(updatedProduct);
  }

  async remove(id: string) {
    const deletedProduct = await this.productModel
      .findByIdAndDelete(id)
      .lean()
      .exec();

    if (!deletedProduct) throw new Error('Product not found');

    return new ResponseProductDto(deletedProduct);
  }

  async getProductCountByType(productType: string) {
    return await this.productModel
      .find({ productType: productType })
      .countDocuments()
      .exec();
  }

  // async updateProductQuantity(productTypeId: string, action: 'inc' | 'dec') {
  //   const updatedProduct = await this.productModel
  //     .findByIdAndUpdate(
  //       productTypeId,
  //       {
  //         updatedAt: new Date(),
  //         updatedBy: SYSTEM,
  //         $inc: { quantity: action === 'inc' ? 1 : -1 },
  //       },
  //       { new: true },
  //     )
  //     .lean()
  //     .exec();
  //
  //   if (!updatedProduct) throw new Error('Product not found');
  //
  //   return new ResponseProductDto(updatedProduct);
  // }
}
