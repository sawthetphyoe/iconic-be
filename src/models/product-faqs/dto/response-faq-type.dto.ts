import { Expose, Transform } from 'class-transformer';


export class ResponseFaqTypeDto {
  @Expose({ name: 'id' })
  @Transform(({ obj }) => obj._id.toString())
  private _id: string;

  @Transform(({ obj }) => new ResponseProduct(obj.product))
  product: any;

  constructor(partial: Partial<ResponseFaqTypeDto>) {
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