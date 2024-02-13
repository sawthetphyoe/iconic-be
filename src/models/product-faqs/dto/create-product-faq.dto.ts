import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductFaqDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsNotEmpty()
  answer: string;

  @IsString()
  @IsNotEmpty()
  productId: string;
}
