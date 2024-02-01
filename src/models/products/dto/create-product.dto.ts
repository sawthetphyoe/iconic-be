import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
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
  @IsOptional()
  @IsString({ each: true })
  availableCpus: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  availableRams: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  availableStorages: string[];
}
