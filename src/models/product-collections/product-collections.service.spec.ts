import { Test, TestingModule } from '@nestjs/testing';
import { ProductCollectionsService } from './product-collections.service';

describe('ProductCollectionsService', () => {
  let service: ProductCollectionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductCollectionsService],
    }).compile();

    service = module.get<ProductCollectionsService>(ProductCollectionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
