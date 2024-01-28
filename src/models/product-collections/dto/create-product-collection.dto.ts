import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductCollectionDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
