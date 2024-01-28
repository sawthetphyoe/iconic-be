import { Injectable } from '@nestjs/common';
import {
  CreateProductTypeDto,
  UpdateProductTypeDto,
} from '@/models/product-types/dto';
import { InjectModel } from '@nestjs/mongoose';
import { ProductType } from '@/models/product-types/schemas/product-type.schema';
import { Model } from 'mongoose';
import { ResponseProductTypeDto } from '@/models/product-types/dto/response-product-type.dto';

@Injectable()
export class ProductTypesService {

  constructor(@InjectModel(ProductType.name) private productTypeModel: Model<ProductType>){}

  async create(createProductTypeDto: CreateProductTypeDto, createdBy: string){
    const newProductType = new this.productTypeModel({ ...createProductTypeDto, createdBy });

    if (!newProductType) throw new Error('Product Type create failed');

    return newProductType.save();
  }
  async findAll() {
    const productTypes = await this.productTypeModel.find().populate('collection').lean().exec();

    if(!productTypes) throw new Error('Product Types not found');

    return productTypes.map((productType) => new ResponseProductTypeDto(productType));
  }

  async findOne(id: string) {
    const productType = await this.productTypeModel.findById(id).lean().exec();

    if(!productType) throw new Error('Product Type not found');

    return new ResponseProductTypeDto(productType);
  }

  update(id: string, updateProductTypeDto: UpdateProductTypeDto) {
    return `This action updates a #${id} productType`;
  }

  remove(id: string) {
    return `This action removes a #${id} productType`;
  }
}
