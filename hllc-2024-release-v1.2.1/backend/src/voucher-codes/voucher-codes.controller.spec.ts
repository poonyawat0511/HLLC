import { Test, TestingModule } from '@nestjs/testing';
import { VoucherCodesController } from './voucher-codes.controller';
import { VoucherCodesService } from './voucher-codes.service';

describe('VoucherCodesController', () => {
  let controller: VoucherCodesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VoucherCodesController],
      providers: [VoucherCodesService],
    }).compile();

    controller = module.get<VoucherCodesController>(VoucherCodesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
