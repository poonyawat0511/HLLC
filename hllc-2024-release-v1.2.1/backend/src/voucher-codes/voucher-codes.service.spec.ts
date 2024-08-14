import { Test, TestingModule } from '@nestjs/testing';
import { VoucherCodesService } from './voucher-codes.service';

describe('VoucherCodesService', () => {
  let service: VoucherCodesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VoucherCodesService],
    }).compile();

    service = module.get<VoucherCodesService>(VoucherCodesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
