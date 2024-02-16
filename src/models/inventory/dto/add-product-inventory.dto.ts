import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddProductInventoryDto {
  @IsString()
  @IsNotEmpty()
  branch: string;

  @IsString()
  @IsNotEmpty()
  product: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsString()
  @IsNotEmpty()
  processor: string;

  @IsString()
  @IsNotEmpty()
  ram: string;

  @IsString()
  @IsNotEmpty()
  storage: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}
