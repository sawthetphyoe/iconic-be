import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ProductFaq } from '@/models/product-faqs/schemas/product-faq.schema';
import { InjectModel } from '@nestjs/mongoose';
import { ResponseFaqTypeDto } from '@/models/product-faqs/dto/response-faq-type.dto';
import { CreateProductFaqDto, UpdateProductFaqDto } from '@/models/product-faqs/dto';

@Injectable()
export class ProductFaqsService {
  constructor(
    @InjectModel(ProductFaq.name)
    private productFaqModel: Model<ProductFaq>,
  ) {
  }

  async create(createProductFaqDto: CreateProductFaqDto, userName: string) {
    const newProductFaq = new this.productFaqModel({
      ...createProductFaqDto,
      createdBy: userName,
    });
    if (!newProductFaq) throw new Error('Product FAQ create failed');
    return newProductFaq.save();
  }

  async findAll() {
    let productFaqs = await this.productFaqModel.find().populate("product","_id name").lean().exec();
    if (!productFaqs) throw new Error('Product FAQs not found');
    return productFaqs.map((productFaq) => {
      return new ResponseFaqTypeDto(productFaq);
    });
  }

  async findOne(id: string) {
    let productFaq = await this.productFaqModel.findById(id).populate("product","_id name").lean().exec();
    if (!productFaq) throw new Error('Product FAQ not found');
    return new ResponseFaqTypeDto(productFaq);
  }

  async update(id: string, updateProductFaqDto: UpdateProductFaqDto, userName: string) {
    let updatedProductFaq = await this.productFaqModel.findByIdAndUpdate(id, {
      ...updateProductFaqDto,
      updatedBy: userName,
    }).lean().exec();
    if (!updatedProductFaq) throw new Error('Product FAQ update failed');
    return new ResponseFaqTypeDto(updatedProductFaq);
  }

  async remove(id: string) {
    let deletedProductFaq = await this.productFaqModel.findByIdAndDelete(id).lean().exec();
    if (!deletedProductFaq) throw new Error('Product FAQ delete failed');
    return new ResponseFaqTypeDto(deletedProductFaq);
  }
}
