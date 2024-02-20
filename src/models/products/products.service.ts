import { Injectable } from '@nestjs/common';
import {
  CreateProductDto,
  ResponseProductDto,
  UpdateProductDto,
} from '@/models/products/dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from '@/models/products/schemas/product.schema';
import mongoose, { Model, SortOrder } from 'mongoose';
import { ProductType } from '@/models/product-types/schemas/product-type.schema';
import { Pageable, ProductColorImage } from '@/interfaces';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(ProductType.name)
    private productTypeModel: Model<ProductType>,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    images: ProductColorImage[],
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
      keyFeatures: createProductDto.keyFeatures
        ? JSON.parse(createProductDto.keyFeatures)
        : [],
      images,
      processors: createProductDto.processors?.split(', ') || [],
      rams: createProductDto.rams?.split(', ') || [],
      storages: createProductDto.storages?.split(', ') || [],
      createdBy,
    });

    if (!newProduct) throw new Error('Product create failed');

    return newProduct.save();
  }

  async findAll(query: ExpressQuery): Promise<Pageable<ResponseProductDto>> {
    const filter = {
      ...(query.name && {
        name: { $regex: query.name, $options: 'i' },
      }),
      ...(query.productType && { productType: query.productType }),
    };

    const currentPage = parseInt(query.page as string) || 1;
    const currentSize = parseInt(query.size as string) || 10;

    const totalRecord = await this.productModel
      .countDocuments({ ...filter })
      .exec();
    const totalPage = Math.ceil(totalRecord / currentSize);

    const sort = (query.sort as string) || 'createdAt';
    const order = (query.order as SortOrder) || 'asc';
    const skip = (currentPage - 1) * currentSize;

    const list = await this.productModel
      .find({ ...filter, isDeleted: false })
      .limit(currentSize)
      .skip(skip)
      .sort({ [sort]: order })
      .populate('productType')
      .lean()
      .exec();

    if (!list) throw new Error('Products not found');

    const dtoList = list.map((product) => {
      return new ResponseProductDto(product);
    });

    return {
      currentPage,
      currentSize,
      totalRecord,
      totalPage,
      dtoList,
    };
  }

  async findOne(id: string) {
    const product = await this.productModel
      .findById(id)
      .populate('productType')
      .lean()
      .exec();

    if (!product) throw new Error('Product not found');

    if (product.isDeleted) throw new Error('Product is already deleted');

    return new ResponseProductDto(product);
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    newImages: ProductColorImage[],
    updatedBy: string,
  ) {
    if (updateProductDto.productType) {
      const isValidId = mongoose.Types.ObjectId.isValid(
        updateProductDto?.productType,
      );
      if (!isValidId) throw new Error('Invalid Product Type ID');
    }

    await this.findOne(id);

    let oldImages = [];

    if (newImages.length > 0) {
      const targetProduct = await this.productModel.findById(id);
      oldImages = targetProduct.images.filter((oldImg) => {
        // Forget to return the result, it took me about 15 minutes to figure out why
        return !newImages.map((img) => img.color).includes(oldImg.color);
      });
    }

    const updatedProduct = await this.productModel
      .findByIdAndUpdate(
        id,
        {
          ...updateProductDto,
          ...(updateProductDto.keyFeatures
            ? { keyFeatures: JSON.parse(updateProductDto.keyFeatures) }
            : {}),
          ...(updateProductDto.processors
            ? { processors: updateProductDto.processors.split(', ') || [] }
            : {}),
          ...(updateProductDto.rams
            ? { rams: updateProductDto.rams.split(', ') || [] }
            : {}),
          ...(updateProductDto.storages
            ? { storages: updateProductDto.storages.split(', ') || [] }
            : {}),
          updatedBy,
          ...(newImages.length > 0
            ? { images: [...oldImages, ...newImages] }
            : {}),
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
    await this.findOne(id);

    const deletedProduct = await this.productModel
      .findByIdAndUpdate(id, { isDeleted: true }, { new: true })
      .populate('productType')
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

  async removeImage(productId: string, imageId: string, updatedBy: string) {
    const product = await this.productModel.findById(productId);
    if (!product) throw new Error('Product not found');

    const updatedProduct = await this.productModel
      .findByIdAndUpdate(
        productId,
        {
          updatedBy,
          images: product.images.filter((image) => image.imageId !== imageId),
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
}
