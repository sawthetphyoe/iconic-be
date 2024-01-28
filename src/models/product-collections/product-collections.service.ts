import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  CreateProductCollectionDto,
  UpdateProductCollectionDto,
} from '@/models/product-collections/dto';
import { RequestUser } from '@/interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { ProductCollection } from '@/models/product-collections/schemas/product-collection.schema';
import { Model } from 'mongoose';
import { ResponseProductCollectionDto } from '@/models/product-collections/dto/response-product-collection.dto';
import { ProductTypesService } from '@/models/product-types/product-types.service';

@Injectable()
export class ProductCollectionsService {
  constructor(
    @InjectModel(ProductCollection.name)
    private productCollectionModel: Model<ProductCollection>,
    private productTypeService: ProductTypesService,
  ) {}
  async create(
    createProductCollectionDto: CreateProductCollectionDto,
    createdBy: string,
  ) {
    const newProductCollection = new this.productCollectionModel({
      ...createProductCollectionDto,
      createdBy,
    });

    if (!newProductCollection)
      throw new Error('Product Collection create failed');

    return newProductCollection.save();
  }

  async findAll() {
    const productCollections = await this.productCollectionModel
      .find()
      .lean()
      .exec();

    if (!productCollections) throw new Error('Product Collections not found');

    return productCollections.map(
      (productCollection) =>
        new ResponseProductCollectionDto(productCollection),
    );
  }

  async findOne(id: string) {
    const productCollection = await this.productCollectionModel
      .findById(id)
      .lean()
      .exec();

    if (!productCollection) throw new Error('Product Collection not found');

    return new ResponseProductCollectionDto(productCollection);
  }

  async update(
    id: string,
    updateProductCollectionDto: UpdateProductCollectionDto,
    updatedBy: string,
  ) {
    const updatedProductCollection = await this.productCollectionModel
      .findByIdAndUpdate(
        id,
        { ...updateProductCollectionDto, updatedBy, updatedAt: new Date() },
        { new: true },
      )
      .lean()
      .exec();

    if (!updatedProductCollection)
      throw new Error('Product Collection not found');

    return new ResponseProductCollectionDto(updatedProductCollection);
  }

  async remove(id: string) {
    const productTypeCount =
      await this.productTypeService.getProductTypeCountForCollection(id);

    if (productTypeCount > 0)
      throw new Error(
        `Cannot delete product collection. This collection has ${productTypeCount} product types assigned to it.`,
      );

    const deletedProductCollection = await this.productCollectionModel
      .findByIdAndDelete(id)
      .lean()
      .exec();

    if (!deletedProductCollection)
      throw new Error('Product Collection not found');

    return new ResponseProductCollectionDto(deletedProductCollection);
  }
}
