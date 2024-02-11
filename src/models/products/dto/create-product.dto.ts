import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsUniqueProduct as IsUnique } from '@/common/decorators';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @IsUnique()
  name: string;

  @IsString()
  @IsNotEmpty()
  productType: string;

  @IsString()
  @IsOptional()
  keyFeatures: string;

  @IsOptional()
  @IsString()
  processors: string;

  @IsOptional()
  @IsString()
  rams: string;

  @IsOptional()
  @IsString()
  storages: string;
}
