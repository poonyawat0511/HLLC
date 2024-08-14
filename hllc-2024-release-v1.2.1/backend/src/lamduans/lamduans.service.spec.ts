import { Test, TestingModule } from '@nestjs/testing';
import { LamduansService } from './lamduans.service';

describe('LamduansService', () => {
  let service: LamduansService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LamduansService],
    }).compile();

    service = module.get<LamduansService>(LamduansService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
