import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MoveInventoryDto {
  @IsString()
  @IsNotEmpty()
  fromBranch: string;

  @IsString()
  @IsNotEmpty()
  toBranch: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  productVariant: string;
}
