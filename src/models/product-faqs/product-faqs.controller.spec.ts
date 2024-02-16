import { Test, TestingModule } from '@nestjs/testing';
import { ProductFaqsController } from './product-faqs.controller';
import { ProductFaqsService } from './product-faqs.service';

describe('ProductFaqsController', () => {
  let controller: ProductFaqsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductFaqsController],
      providers: [ProductFaqsService],
    }).compile();

    controller = module.get<ProductFaqsController>(ProductFaqsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
