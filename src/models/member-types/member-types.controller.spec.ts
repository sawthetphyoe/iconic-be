import { Test, TestingModule } from '@nestjs/testing';
import { MemberTypesController } from './member-types.controller';
import { MemberTypesService } from './member-types.service';

describe('MemberTypesController', () => {
  let controller: MemberTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberTypesController],
      providers: [MemberTypesService],
    }).compile();

    controller = module.get<MemberTypesController>(MemberTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
