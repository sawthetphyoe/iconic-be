import { PartialType } from '@nestjs/mapped-types';
import { CreateProductCollectionDto } from './create-product-collection.dto';

export class UpdateProductCollectionDto extends PartialType(CreateProductCollectionDto) {}
