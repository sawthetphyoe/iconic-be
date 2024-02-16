import { Injectable } from '@nestjs/common';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ProductVariant } from '@/models/product-variants/schemas/product-variant.schemas';
import { Model } from 'mongoose';

type FilterDataType = {
  product: string;
  color: string;
  processor: string;
  ram: string;
  storage: string;
};

@Injectable()
export class ProductVariantsService {
  constructor(@InjectModel(ProductVariant.name) private productVariantModel: Model<ProductVariant>) {
  }

  async create(createProductVariantDto: CreateProductVariantDto, userName: string) {
    let newProductVariant = new this.productVariantModel({
      ...createProductVariantDto,
      createdBy: userName,
    });
    if (!newProductVariant) throw new Error('Product Variant create failed');
    return newProductVariant.save();
  }

  findAll() {
    return `This action returns all productVariants`;
  }

  async findBy(filterData: FilterDataType) {
    return  await this.productVariantModel.find(filterData).lean().exec();
  }

  async findOne(id: number) {
    let productVariant = await this.productVariantModel.findById(id).lean().exec();
    if (!productVariant) throw new Error('Product Variant not found');
    return productVariant;
  }

  update(id: number, updateProductVariantDto: UpdateProductVariantDto) {
    return `This action updates a #${id} productVariant`;
  }

  remove(id: number) {
    return `This action removes a #${id} productVariant`;
  }
}
