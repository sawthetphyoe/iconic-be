import { Injectable } from '@nestjs/common';
import {
  CreateProductTypeDto,
  UpdateProductTypeDto,
} from '@/models/product-types/dto';

@Injectable()
export class ProductTypesService {
  create(createProductTypeDto: CreateProductTypeDto) {
    return 'This action adds a new productType';
  }

  findAll() {
    return `This action returns all productTypes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productType`;
  }

  update(id: number, updateProductTypeDto: UpdateProductTypeDto) {
    return `This action updates a #${id} productType`;
  }

  remove(id: number) {
    return `This action removes a #${id} productType`;
  }
}
