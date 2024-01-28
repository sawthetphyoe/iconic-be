import { Test, TestingModule } from '@nestjs/testing';
import { ProductCollectionsController } from './product-collections.controller';
import { ProductCollectionsService } from './product-collections.service';

describe('ProductCollectionsController', () => {
  let controller: ProductCollectionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductCollectionsController],
      providers: [ProductCollectionsService],
    }).compile();

    controller = module.get<ProductCollectionsController>(ProductCollectionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
