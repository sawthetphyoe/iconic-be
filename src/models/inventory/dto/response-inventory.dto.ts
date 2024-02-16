import { Expose, Transform } from 'class-transformer';

export class ResponseInventoryDto {
  @Expose({ name: 'id' })
  @Transform(({ obj }) => obj._id.toString())
  private _id: string;

  @Transform(({ obj }) => new ResponseBranchDto(obj.branch))
  branch: any;

  @Transform(({ obj }) => new ResponseProductVariantDto(obj.productVariant))
  productVariant:any;

  constructor(partial: Partial<ResponseInventoryDto>) {
    Object.assign(this, partial);
  }
}


class ResponseProductVariantDto{
  @Expose({ name: 'id' })
  @Transform(({ obj }) => obj._id.toString())
  private _id: string;

  @Transform(({ obj }) => new ResponseProduct(obj.product))
  private product: any;

  constructor(partial: Partial<ResponseProductVariantDto>) {
    Object.assign(this, partial);
  }
}

class ResponseBranchDto{
  @Expose({ name: 'id' })
  @Transform(({ obj }) => obj._id.toString())
  private _id: string;

  constructor(partial: Partial<ResponseBranchDto>) {
    Object.assign(this, partial);
  }
}

class ResponseProduct {
  @Expose({ name: 'id' })
  @Transform(({ obj }) => obj._id.toString())
  private _id: string;

  constructor(partial: Partial<ResponseProduct>) {
    Object.assign(this, partial);
  }
}