import { Test, TestingModule } from '@nestjs/testing';
import { PretestController } from './pretests.controller';
import { PretestService } from './pretests.service';

describe('PretestController', () => {
  let controller: PretestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PretestController],
      providers: [PretestService],
    }).compile();

    controller = module.get<PretestController>(PretestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
