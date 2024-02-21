import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
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
