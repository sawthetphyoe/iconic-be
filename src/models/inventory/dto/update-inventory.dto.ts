import { PartialType } from '@nestjs/mapped-types';
import { AddProductInventoryDto } from './add-product-inventory.dto';

export class UpdateInventoryDto extends PartialType(AddProductInventoryDto) {}
