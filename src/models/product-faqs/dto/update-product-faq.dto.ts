import { PartialType } from '@nestjs/mapped-types';
import { CreateProductFaqDto } from './create-product-faq.dto';

export class UpdateProductFaqDto extends PartialType(CreateProductFaqDto) {}
