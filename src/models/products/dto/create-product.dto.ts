import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { IsUniqueProduct as IsUnique } from '@/common/decorators';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @IsUnique()
  name: string;

  @IsString()
  @IsNotEmpty()
  productType: string;

  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  colors: string[];
}
