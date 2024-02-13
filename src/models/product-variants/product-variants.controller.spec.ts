import { Test, TestingModule } from '@nestjs/testing';
import { ProductVariantsController } from './product-variants.controller';
import { ProductVariantsService } from './product-variants.service';

describe('ProductVariantsController', () => {
  let controller: ProductVariantsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductVariantsController],
      providers: [ProductVariantsService],
    }).compile();

    controller = module.get<ProductVariantsController>(ProductVariantsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
