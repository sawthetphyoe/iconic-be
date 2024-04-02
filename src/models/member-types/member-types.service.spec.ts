import { Test, TestingModule } from '@nestjs/testing';
import { MemberTypesService } from './member-types.service';

describe('MemberTypesService', () => {
  let service: MemberTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MemberTypesService],
    }).compile();

    service = module.get<MemberTypesService>(MemberTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
