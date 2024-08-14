import { Test, TestingModule } from '@nestjs/testing';
import { LamduansController } from './lamduans.controller';
import { LamduansService } from './lamduans.service';

describe('LamduansController', () => {
  let controller: LamduansController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LamduansController],
      providers: [LamduansService],
    }).compile();

    controller = module.get<LamduansController>(LamduansController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
