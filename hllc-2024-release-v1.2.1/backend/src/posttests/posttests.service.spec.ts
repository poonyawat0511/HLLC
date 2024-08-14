import { Test, TestingModule } from '@nestjs/testing';
import { PosttestsService } from './posttests.service';

describe('PosttestsService', () => {
  let service: PosttestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PosttestsService],
    }).compile();

    service = module.get<PosttestsService>(PosttestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
