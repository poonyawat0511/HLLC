import { Test, TestingModule } from '@nestjs/testing';
import { PretestService } from './pretests.service';

describe('PretestService', () => {
  let service: PretestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PretestService],
    }).compile();

    service = module.get<PretestService>(PretestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
