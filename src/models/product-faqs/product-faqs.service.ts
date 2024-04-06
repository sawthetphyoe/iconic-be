import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ProductFaq } from '@/models/product-faqs/schemas/product-faq.schema';
import { InjectModel } from '@nestjs/mongoose';
import { ResponseFaqDto } from '@/models/product-faqs/dto/response-faq.dto';
import {
  CreateProductFaqDto,
  UpdateProductFaqDto,
} from '@/models/product-faqs/dto';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Injectable()
export class ProductFaqsService {
  constructor(
    @InjectModel(ProductFaq.name)
    private productFaqModel: Model<ProductFaq>,
  ) {}

  async create(createProductFaqDto: CreateProductFaqDto, userName: string) {
    const newProductFaq = new this.productFaqModel({
      ...createProductFaqDto,
      createdBy: userName,
    });
    if (!newProductFaq) throw new Error('Product FAQ create failed');
    return newProductFaq.save();
  }

  async findAll(query: ExpressQuery) {
    const filter = {
      ...(query.product && { product: query.product }),
    };
    const productFaqs = await this.productFaqModel
      .find({ ...filter })
      .populate('product', '_id name')
      .lean()
      .exec();
    if (!productFaqs) throw new Error('Product FAQs not found');
    return productFaqs.map((productFaq) => {
      return new ResponseFaqDto(productFaq);
    });
  }

  async findOne(id: string) {
    const productFaq = await this.productFaqModel
      .findById(id)
      .populate('product', '_id name')
      .lean()
      .exec();
    if (!productFaq) throw new Error('Product FAQ not found');
    return new ResponseFaqDto(productFaq);
  }

  async update(
    id: string,
    updateProductFaqDto: UpdateProductFaqDto,
    userName: string,
  ) {
    const updatedProductFaq = await this.productFaqModel
      .findByIdAndUpdate(id, {
        ...updateProductFaqDto,
        updatedBy: userName,
      })
      .lean()
      .exec();
    if (!updatedProductFaq) throw new Error('Product FAQ update failed');
    return new ResponseFaqDto(updatedProductFaq);
  }

  async remove(id: string) {
    const deletedProductFaq = await this.productFaqModel
      .findByIdAndDelete(id)
      .lean()
      .exec();
    if (!deletedProductFaq) throw new Error('Product FAQ delete failed');
    return new ResponseFaqDto(deletedProductFaq);
  }
}
