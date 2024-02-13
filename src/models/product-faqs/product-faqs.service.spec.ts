import { Test, TestingModule } from '@nestjs/testing';
import { ProductFaqsService } from './product-faqs.service';

describe('ProductFaqsService', () => {
  let service: ProductFaqsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductFaqsService],
    }).compile();

    service = module.get<ProductFaqsService>(ProductFaqsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
