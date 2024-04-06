import { Expose, Transform } from 'class-transformer';
import mongoose from 'mongoose';
import { Product } from '@/models/products/schemas/product.schema';
import { ProductType } from '@/models/product-types/schemas/product-type.schema';
import { ProductColorImage } from '@/interfaces';
import { ResponseInventoryDto } from '@/models/inventories/dto';

export class ResponseProductVariantDto {
  @Expose({ name: 'id' })
  @Transform(({ obj }) => obj._id.toString())
  _id: mongoose.Types.ObjectId;

  @Transform(({ obj }) => new ResponseProductVariantProduct(obj.product))
  product: Product & { _id?: mongoose.Schema.Types.ObjectId };

  price: number;

  image: ProductColorImage;

  inventories: ResponseInventoryDto[];

  constructor(partial: Partial<ResponseProductVariantDto>) {
    Object.assign(this, partial);
  }
}

class ResponseProductVariantProduct {
  @Expose({ name: 'id' })
  @Transform(({ obj }) => obj._id.toString())
  private _id: string;

  @Transform(
    ({ obj }) => new ResponseProductVariantProductType(obj.productType),
  )
  productType: ProductType & { _id: mongoose.Schema.Types.ObjectId };

  constructor(partial: Partial<ResponseProductVariantProduct>) {
    Object.assign(this, partial);
  }
}

class ResponseProductVariantProductType {
  @Expose({ name: 'id' })
  @Transform(({ obj }) => obj._id.toString())
  _id: mongoose.Types.ObjectId;

  constructor(partial: Partial<ResponseProductVariantProductType>) {
    Object.assign(this, partial);
  }
}
