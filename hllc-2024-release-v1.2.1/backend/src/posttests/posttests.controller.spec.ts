import { Test, TestingModule } from '@nestjs/testing';
import { PosttestsController } from './posttests.controller';
import { PosttestsService } from './posttests.service';

describe('PosttestsController', () => {
  let controller: PosttestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PosttestsController],
      providers: [PosttestsService],
    }).compile();

    controller = module.get<PosttestsController>(PosttestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
