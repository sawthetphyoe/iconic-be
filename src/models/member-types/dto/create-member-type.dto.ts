import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMemberTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  minAmount: number;
}
