import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  CreateProductTypeDto,
  UpdateProductTypeDto,
} from '@/models/product-types/dto';
import { InjectModel } from '@nestjs/mongoose';
import { ProductType } from '@/models/product-types/schemas/product-type.schema';
import mongoose, { Model } from 'mongoose';
import { ResponseProductTypeDto } from '@/models/product-types/dto/response-product-type.dto';
import { ProductCollection } from '@/models/product-collections/schemas/product-collection.schema';
import { SYSTEM } from '@/common/constants';
import { ResponseBranchDto } from '@/models/branches/dto/response-branch.dto';

@Injectable()
export class ProductTypesService {
  constructor(
    @InjectModel(ProductType.name) private productTypeModel: Model<ProductType>,
    @InjectModel(ProductCollection.name)
    private productCollectionModel: Model<ProductCollection>,
  ) {}

  async create(createProductTypeDto: CreateProductTypeDto, createdBy: string) {
    const isValidId = mongoose.Types.ObjectId.isValid(
      createProductTypeDto.parentCollection,
    );
    if (!isValidId) throw new Error('Invalid Collection ID');

    const collection = await this.productCollectionModel.findById(
      createProductTypeDto.parentCollection,
    );

    if (!collection) throw new Error('Invalid Collection ID');

    const newProductType = new this.productTypeModel({
      ...createProductTypeDto,
      createdBy,
    });

    if (!newProductType) throw new Error('Product Type create failed');

    return newProductType.save();
  }

  async findAll() {
    const productTypes = await this.productTypeModel
      .find()
      .populate('parentCollection')
      .lean()
      .exec();

    if (!productTypes) throw new Error('Product Types not found');

    return productTypes.map(
      (productType) => new ResponseProductTypeDto(productType),
    );
  }

  async findOne(id: string) {
    const productType = await this.productTypeModel
      .findById(id)
      .populate('parentCollection')
      .lean()
      .exec();

    if (!productType) throw new Error('Product Type not found');

    return new ResponseProductTypeDto(productType);
  }

  async update(
    id: string,
    updateProductTypeDto: UpdateProductTypeDto,
    updatedBy: string,
  ) {
    if (updateProductTypeDto.parentCollection) {
      const isValidId = mongoose.Types.ObjectId.isValid(
        updateProductTypeDto?.parentCollection,
      );
      if (!isValidId) throw new Error('Invalid Collection ID');
    }

    const updatedProductType = await this.productTypeModel
      .findByIdAndUpdate(
        id,
        {
          ...updateProductTypeDto,
          updatedBy,
          updatedAt: new Date(),
        },
        { new: true },
      )
      .populate('parentCollection')
      .lean()
      .exec();

    if (!updatedProductType) throw new Error('Product Type not found');

    return new ResponseProductTypeDto(updatedProductType);
  }

  async remove(id: string) {
    const deletedProductType = await this.productTypeModel
      .findByIdAndDelete(id)
      .lean()
      .exec();

    if (!deletedProductType) throw new Error('Product Type not found');

    return new ResponseProductTypeDto(deletedProductType);
  }

  async getProductTypeCountForCollection(collectionId: string) {
    return await this.productTypeModel
      .find({ collection: collectionId })
      .countDocuments()
      .exec();
  }

  async updateProductCount(productTypeId: string, action: 'inc' | 'dec') {
    const updatedProductType = await this.productTypeModel
      .findByIdAndUpdate(
        productTypeId,
        {
          updatedAt: new Date(),
          updatedBy: SYSTEM,
          $inc: { productCount: action === 'inc' ? 1 : -1 },
        },
        { new: true },
      )
      .lean()
      .exec();

    if (!updatedProductType) throw new Error('Product type not found');

    return new ResponseProductTypeDto(updatedProductType);
  }
}
