import { OrderStatus } from '@/enums';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ApproveOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => ApprovedOrderItem)
  orderItems: ApprovedOrderItem[];
}

class ApprovedOrderItem {
  @IsString()
  @IsNotEmpty()
  productVariantId: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  @IsString()
  branch: string;
}
