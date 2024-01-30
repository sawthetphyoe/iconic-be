import { IsNotEmpty, IsString } from 'class-validator';
import { IsUniqueProductType as IsUnique } from '@/common/decorators';

export class CreateProductTypeDto {
  @IsString()
  @IsNotEmpty()
  @IsUnique()
  name: string;
}
