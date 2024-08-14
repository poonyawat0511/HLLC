import { Test, TestingModule } from '@nestjs/testing';
import { CheckInsController } from './check-ins.controller';
import { CheckInsService } from './check-ins.service';

describe('CheckInsController', () => {
  let controller: CheckInsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CheckInsController],
      providers: [CheckInsService],
    }).compile();

    controller = module.get<CheckInsController>(CheckInsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
