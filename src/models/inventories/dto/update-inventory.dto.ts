import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateInventoryDto {
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
